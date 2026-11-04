from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.user import User
from backend.app.models.resume import Resume
from backend.app.api.v1.auth import get_current_user
from document_processing.exporter import DocumentExporter

router = APIRouter(prefix="/export", tags=["Export Center"])

@router.get("/pdf/{resume_id}")
def export_pdf(resume_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    pdf_buffer = DocumentExporter.generate_pdf(resume.content)
    clean_name = (resume.title or "resume").replace(" ", "_")
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={clean_name}.pdf"}
    )

@router.get("/docx/{resume_id}")
def export_docx(resume_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    docx_buffer = DocumentExporter.generate_docx(resume.content)
    clean_name = (resume.title or "resume").replace(" ", "_")
    return StreamingResponse(
        docx_buffer,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={"Content-Disposition": f"attachment; filename={clean_name}.docx"}
    )
