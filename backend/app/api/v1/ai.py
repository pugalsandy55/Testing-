from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.models.user import User
from backend.app.models.resume import Resume
from backend.app.schemas.ai import (
    AIOptimizeSummaryRequest,
    AIOptimizeBulletRequest,
    AISkillRecommendationRequest,
    AICoverLetterRequest,
    AIResponse
)
from backend.app.api.v1.auth import get_current_user
from ai_engine.provider import AIProvider

router = APIRouter(prefix="/ai", tags=["AI Resume Optimization"])

@router.post("/optimize-summary", response_model=AIResponse)
def optimize_summary(req: AIOptimizeSummaryRequest, current_user: User = Depends(get_current_user)):
    result = AIProvider.optimize_summary(
        current_summary=req.current_summary,
        target_role=req.target_role or "Professional",
        skills=req.skills,
        tone=req.tone or "executive"
    )
    return {
        "success": True,
        "result": result,
        "suggestions": [
            "Keep the summary between 3-4 impactful sentences.",
            "Include your core tech stack and years of experience.",
            "Highlight one major quantifiable accomplishment."
        ],
        "metadata": {"tone": req.tone}
    }

@router.post("/optimize-bullet", response_model=AIResponse)
def optimize_bullet(req: AIOptimizeBulletRequest, current_user: User = Depends(get_current_user)):
    result = AIProvider.optimize_bullet(
        bullet_point=req.bullet_point,
        target_role=req.target_role or ""
    )
    return {
        "success": True,
        "result": result,
        "suggestions": [
            "Approved changes can be applied directly to your resume editor.",
            "Verify all numbers and metrics reflect your actual accomplishments."
        ],
        "metadata": {"method": result.get("improvement_type")}
    }

@router.post("/recommend-skills", response_model=AIResponse)
def recommend_skills(req: AISkillRecommendationRequest, current_user: User = Depends(get_current_user)):
    skills = AIProvider.recommend_skills(
        current_skills=req.current_skills,
        target_role=req.target_role,
        job_description=req.job_description
    )
    return {
        "success": True,
        "result": skills,
        "suggestions": [
            "Add only skills you are comfortable answering interview questions about."
        ],
        "metadata": {"count": len(skills)}
    }

@router.post("/generate-cover-letter", response_model=AIResponse)
def generate_cover_letter(req: AICoverLetterRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    candidate_name = current_user.full_name or "Candidate"
    skills = []
    exp_summary = ""

    if req.resume_id:
        resume = db.query(Resume).filter(Resume.id == req.resume_id, Resume.user_id == current_user.id).first()
        if resume and resume.content:
            candidate_name = resume.content.get("personal_info", {}).get("full_name") or candidate_name
            skills = resume.content.get("skills", [])
            exp_list = resume.content.get("experience", [])
            if exp_list:
                first_exp = exp_list[0]
                exp_summary = f"I served as {first_exp.get('position')} at {first_exp.get('company')}, leading critical milestones"

    cover_letter = AIProvider.generate_cover_letter(
        job_title=req.job_title,
        company_name=req.company_name,
        candidate_name=candidate_name,
        experience_summary=exp_summary,
        skills=skills
    )

    return {
        "success": True,
        "result": cover_letter,
        "suggestions": [
            "Personalize the company mission statement in paragraph 3.",
            "Verify the hiring manager's name if available."
        ],
        "metadata": {"job_title": req.job_title, "company_name": req.company_name}
    }
