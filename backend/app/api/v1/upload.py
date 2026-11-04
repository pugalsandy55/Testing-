import os
import uuid
import shutil
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.user import User
from backend.app.models.resume import Resume
from backend.app.api.v1.auth import get_current_user
from backend.app.config import settings
from document_processing.parser import DocumentParser
from backend.app.services.ats_analyzer import ATSScoringEngine

router = APIRouter(prefix="/upload", tags=["Resume Upload & Parsing"])

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".doc", ".txt"}

@router.post("")
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Unsupported file format '{ext}'. Allowed: PDF, DOCX, DOC, TXT")

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    unique_filename = f"{uuid.uuid4().hex}_{file.filename}"
    file_path = os.path.join(settings.UPLOAD_DIR, unique_filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract text and parse structured data
    raw_text = DocumentParser.extract_text(file_path, file.filename)
    if not raw_text or len(raw_text.strip()) < 10:
        raise HTTPException(status_code=422, detail="Unable to extract text from document. Ensure file is not corrupt or password-protected.")

    parsed_content = DocumentParser.parse_resume(raw_text)
    
    # Calculate initial ATS compatibility score
    ats_res = ATSScoringEngine.analyze(parsed_content, job_title=parsed_content.get("personal_info", {}).get("headline", ""))

    resume_title = f"{parsed_content.get('personal_info', {}).get('full_name', 'Parsed')} - Resume"

    new_resume = Resume(
        user_id=current_user.id,
        title=resume_title,
        target_role=parsed_content.get("personal_info", {}).get("headline", "Software Engineer"),
        template_id="tpl-ats-friendly-1col-classic-corporate-navy-0001",
        content=parsed_content,
        design_settings={
            "font_family": "Inter",
            "font_size": "medium",
            "primary_color": "#0e87ea",
            "secondary_color": "#1e293b",
            "accent_color": "#64748b",
            "line_spacing": "normal",
            "margins": "normal",
            "section_order": ["summary", "experience", "education", "skills", "projects", "certifications", "languages"]
        },
        ats_score=ats_res["overall_score"],
        ats_details=ats_res
    )
    db.add(new_resume)
    db.commit()
    db.refresh(new_resume)

    return {
        "success": True,
        "message": "Resume uploaded and parsed successfully",
        "resume_id": new_resume.id,
        "raw_text_length": len(raw_text),
        "parsed_content": parsed_content,
        "ats_score": ats_res["overall_score"]
    }
