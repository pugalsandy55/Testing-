from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.database import get_db
from backend.app.models.user import User
from backend.app.models.resume import Resume
from backend.app.schemas.resume import ResumeCreate, ResumeUpdate, ResumeResponse
from backend.app.api.v1.auth import get_current_user
from backend.app.services.ats_analyzer import ATSScoringEngine

router = APIRouter(prefix="/resumes", tags=["Resumes"])

@router.get("", response_model=List[ResumeResponse])
def list_resumes(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Resume).filter(Resume.user_id == current_user.id).order_by(Resume.updated_at.desc()).all()

@router.post("", response_model=ResumeResponse)
def create_resume(resume_in: ResumeCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    content_dict = resume_in.content.model_dump() if resume_in.content else {
        "personal_info": {"full_name": current_user.full_name or "Alex Morgan", "email": current_user.email, "phone": "+1 (555) 019-2834", "location": "San Francisco, CA", "headline": "Senior Software Engineer", "website": "", "linkedin": "linkedin.com/in/alexmorgan", "github": "github.com/alexmorgan"},
        "summary": "Innovative software engineer with 5+ years of experience designing and deploying high-availability microservices, RESTful APIs, and cloud-native applications.",
        "experience": [
            {"id": "exp-1", "company": "Stripe", "position": "Senior Software Engineer", "location": "San Francisco, CA", "start_date": "2022", "end_date": "Present", "current": True, "highlights": ["Engineered distributed payment orchestration services processing $50M+ daily volume.", "Decreased checkout API latency by 38% through Redis query caching.", "Mentored 4 junior engineers on distributed systems and clean architecture."]},
            {"id": "exp-2", "company": "Twilio", "position": "Software Engineer", "location": "Remote", "start_date": "2019", "end_date": "2022", "current": False, "highlights": ["Maintained telephony messaging microservices with 99.999% SLA.", "Automated CI/CD deployment pipelines using GitHub Actions and Docker."]}
        ],
        "education": [
            {"id": "edu-1", "institution": "University of California, Berkeley", "degree": "B.S. Computer Science", "field_of_study": "Computer Science", "start_date": "2015", "end_date": "2019", "gpa": "3.8/4.0"}
        ],
        "skills": ["Python", "TypeScript", "React", "FastAPI", "PostgreSQL", "Docker", "AWS", "Kubernetes", "Redis", "Git", "REST APIs"],
        "projects": [
            {"id": "proj-1", "title": "Real-Time Telemetry Monitor", "role": "Architect", "url": "https://github.com/example/telemetry", "description": "High-throughput metric ingestion pipeline built with FastAPI and WebSockets.", "technologies": ["Python", "FastAPI", "Redis"]}
        ],
        "certifications": [
            {"id": "cert-1", "name": "AWS Certified Solutions Architect", "issuer": "Amazon Web Services", "date": "2023", "url": ""}
        ],
        "languages": [
            {"id": "lang-1", "language": "English", "proficiency": "Native"}
        ],
        "awards": []
    }

    design_dict = resume_in.design_settings.model_dump() if resume_in.design_settings else {
        "font_family": "Inter",
        "font_size": "medium",
        "primary_color": "#0e87ea",
        "secondary_color": "#1e293b",
        "accent_color": "#64748b",
        "line_spacing": "normal",
        "margins": "normal",
        "section_order": ["summary", "experience", "education", "skills", "projects", "certifications", "languages"]
    }

    # Calculate initial ATS score
    ats_result = ATSScoringEngine.analyze(content_dict, job_title=resume_in.target_role or "")

    resume = Resume(
        user_id=current_user.id,
        title=resume_in.title,
        target_role=resume_in.target_role,
        template_id=resume_in.template_id,
        content=content_dict,
        design_settings=design_dict,
        ats_score=ats_result["overall_score"],
        ats_details=ats_result
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)
    return resume

@router.get("/{resume_id}", response_model=ResumeResponse)
def get_resume(resume_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume

@router.put("/{resume_id}", response_model=ResumeResponse)
def update_resume(resume_id: int, resume_in: ResumeUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")

    if resume_in.title is not None: resume.title = resume_in.title
    if resume_in.target_role is not None: resume.target_role = resume_in.target_role
    if resume_in.template_id is not None: resume.template_id = resume_in.template_id
    if resume_in.content is not None:
        resume.content = resume_in.content
        # Recompute ATS score
        ats_res = ATSScoringEngine.analyze(resume.content, job_title=resume.target_role or "")
        resume.ats_score = ats_res["overall_score"]
        resume.ats_details = ats_res
    if resume_in.design_settings is not None: resume.design_settings = resume_in.design_settings

    db.commit()
    db.refresh(resume)
    return resume

@router.delete("/{resume_id}")
def delete_resume(resume_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    resume = db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == current_user.id).first()
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    db.delete(resume)
    db.commit()
    return {"message": "Resume successfully deleted"}
