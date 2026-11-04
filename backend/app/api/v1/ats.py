from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.user import User
from backend.app.models.resume import Resume
from backend.app.schemas.ats import ATSCheckRequest, ATSCheckResponse
from backend.app.api.v1.auth import get_current_user
from backend.app.services.ats_analyzer import ATSScoringEngine

router = APIRouter(prefix="/ats", tags=["ATS Checker"])

@router.post("/check", response_model=ATSCheckResponse)
def check_ats(req: ATSCheckRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    content = req.resume_content
    if not content and req.resume_id:
        resume = db.query(Resume).filter(Resume.id == req.resume_id, Resume.user_id == current_user.id).first()
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")
        content = resume.content

    if not content:
        raise HTTPException(status_code=400, detail="No resume content provided for analysis")

    result = ATSScoringEngine.analyze(
        resume_content=content,
        job_title=req.job_title or "",
        job_description=req.job_description or ""
    )

    # If linked to a resume, update cached score
    if req.resume_id:
        resume = db.query(Resume).filter(Resume.id == req.resume_id).first()
        if resume:
            resume.ats_score = result["overall_score"]
            resume.ats_details = result
            db.commit()

    return result
