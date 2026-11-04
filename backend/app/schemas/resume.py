from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class PersonalInfo(BaseModel):
    full_name: str = ""
    email: str = ""
    phone: str = ""
    location: str = ""
    headline: str = ""
    website: str = ""
    linkedin: str = ""
    github: str = ""

class ExperienceItem(BaseModel):
    id: str
    company: str = ""
    position: str = ""
    location: str = ""
    start_date: str = ""
    end_date: str = ""
    current: bool = False
    highlights: List[str] = []

class EducationItem(BaseModel):
    id: str
    institution: str = ""
    degree: str = ""
    field_of_study: str = ""
    start_date: str = ""
    end_date: str = ""
    gpa: str = ""

class ProjectItem(BaseModel):
    id: str
    title: str = ""
    role: str = ""
    url: str = ""
    description: str = ""
    technologies: List[str] = []

class CertificationItem(BaseModel):
    id: str
    name: str = ""
    issuer: str = ""
    date: str = ""
    url: str = ""

class LanguageItem(BaseModel):
    id: str
    language: str = ""
    proficiency: str = ""

class AwardItem(BaseModel):
    id: str
    title: str = ""
    issuer: str = ""
    date: str = ""

class ResumeContent(BaseModel):
    personal_info: PersonalInfo = PersonalInfo()
    summary: str = ""
    experience: List[ExperienceItem] = []
    education: List[EducationItem] = []
    skills: List[str] = []
    projects: List[ProjectItem] = []
    certifications: List[CertificationItem] = []
    languages: List[LanguageItem] = []
    awards: List[AwardItem] = []

class DesignSettings(BaseModel):
    font_family: str = "Inter"
    font_size: str = "medium" # small, medium, large
    primary_color: str = "#0e87ea"
    secondary_color: str = "#1e293b"
    accent_color: str = "#64748b"
    line_spacing: str = "normal" # tight, normal, relaxed
    margins: str = "normal" # compact, normal, spacious
    section_order: List[str] = [
        "summary", "experience", "education", "skills", "projects", "certifications", "languages", "awards"
    ]

class ResumeCreate(BaseModel):
    title: str = "Untitled Resume"
    target_role: Optional[str] = None
    template_id: str = "modern-ats-001"
    content: Optional[ResumeContent] = None
    design_settings: Optional[DesignSettings] = None

class ResumeUpdate(BaseModel):
    title: Optional[str] = None
    target_role: Optional[str] = None
    template_id: Optional[str] = None
    content: Optional[Dict[str, Any]] = None
    design_settings: Optional[Dict[str, Any]] = None
    ats_score: Optional[int] = None
    ats_details: Optional[Dict[str, Any]] = None

class ResumeResponse(BaseModel):
    id: int
    user_id: int
    title: str
    target_role: Optional[str] = None
    template_id: str
    content: Dict[str, Any]
    design_settings: Dict[str, Any]
    ats_score: int
    ats_details: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
