from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, JSON
from datetime import datetime
from backend.app.database import Base

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String, default="Untitled Resume")
    target_role = Column(String, nullable=True)
    template_id = Column(String, default="modern-ats-001")
    
    # Complete structured resume content stored as JSON
    # personal_info, summary, experience, education, skills, projects, certifications, languages, awards
    content = Column(JSON, nullable=False, default=dict)
    
    # Design custom styling (fonts, colors, spacing, layout settings)
    design_settings = Column(JSON, nullable=False, default=dict)
    
    # Cached latest ATS score metrics
    ats_score = Column(Integer, default=0)
    ats_details = Column(JSON, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
