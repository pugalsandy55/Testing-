from sqlalchemy import Column, Integer, String, Boolean, JSON, DateTime
from datetime import datetime
from backend.app.database import Base

class ResumeTemplate(Base):
    __tablename__ = "resume_templates"

    id = Column(String, primary_key=True, index=True) # e.g. "tech-modern-teal-001"
    name = Column(String, nullable=False, index=True)
    category = Column(String, nullable=False, index=True) # e.g. "Software Engineer", "Executive", etc.
    industry = Column(String, nullable=False, index=True)
    is_premium = Column(Boolean, default=False)
    is_ats_friendly = Column(Boolean, default=True)
    
    # Layout engine configuration (columns: 1 or 2, sidebar_position, header_style, section_order)
    layout_config = Column(JSON, nullable=False, default=dict)
    
    # Style configuration (font_family, font_size, primary_color, secondary_color, accent_color, line_spacing)
    style_config = Column(JSON, nullable=False, default=dict)
    
    tags = Column(JSON, nullable=False, default=list)
    rating = Column(String, default="4.9")
    uses_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
