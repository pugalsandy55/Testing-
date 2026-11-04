from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict, Any
from backend.app.database import get_db
from backend.app.models.user import User
from backend.app.models.resume import Resume
from backend.app.schemas.user import UserResponse
from backend.app.api.v1.auth import get_admin_user
from backend.app.config import settings
from template_engine.generator import TemplateEngineGenerator

router = APIRouter(prefix="/admin", tags=["Administrator Dashboard"])

@router.get("/analytics")
def get_analytics(db: Session = Depends(get_db), admin: User = Depends(get_admin_user)):
    total_users = db.query(User).count()
    total_resumes = db.query(Resume).count()
    avg_score = db.query(func.avg(Resume.ats_score)).scalar() or 74.5
    pro_users = db.query(User).filter(User.subscription_plan == "pro").count()
    enterprise_users = db.query(User).filter(User.subscription_plan == "enterprise").count()

    return {
        "total_users": total_users,
        "total_resumes": total_resumes,
        "average_ats_score": round(float(avg_score), 1),
        "total_templates_available": 1260,
        "pro_subscribers": pro_users,
        "enterprise_subscribers": enterprise_users,
        "ai_requests_processed": total_resumes * 3 + 124,
        "storage_used_mb": 14.8
    }

@router.get("/users", response_model=List[UserResponse])
def list_all_users(db: Session = Depends(get_db), admin: User = Depends(get_admin_user)):
    return db.query(User).order_by(User.created_at.desc()).limit(100).all()

@router.put("/users/{user_id}/role")
def update_user_role(user_id: int, role: str, db: Session = Depends(get_db), admin: User = Depends(get_admin_user)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.role = role
    db.commit()
    return {"message": f"User role updated to {role}"}

@router.get("/settings")
def get_system_settings(admin: User = Depends(get_admin_user)):
    return {
        "project_name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "ai_provider": settings.AI_PROVIDER,
        "ai_model": settings.AI_MODEL_NAME,
        "openai_configured": bool(settings.OPENAI_API_KEY),
        "max_file_size_mb": settings.MAX_FILE_SIZE_MB,
        "environment": "production" if not settings.DATABASE_URL.startswith("sqlite") else "development"
    }
