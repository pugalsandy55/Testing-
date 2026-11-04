from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, JSON
from datetime import datetime
from backend.app.database import Base

class ATSAnalysis(Base):
    __tablename__ = "ats_analyses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id"), nullable=True, index=True)
    job_title = Column(String, nullable=True)
    job_description = Column(Text, nullable=True)
    
    overall_score = Column(Integer, nullable=False)
    keyword_match_pct = Column(Integer, default=0)
    structure_score = Column(Integer, default=0)
    skills_score = Column(Integer, default=0)
    formatting_score = Column(Integer, default=0)
    
    missing_keywords = Column(JSON, default=list)
    formatting_warnings = Column(JSON, default=list)
    recommendations = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)
