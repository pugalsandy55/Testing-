from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class AIOptimizeSummaryRequest(BaseModel):
    current_summary: str
    target_role: Optional[str] = None
    skills: List[str] = []
    years_of_experience: Optional[int] = None
    tone: Optional[str] = "executive" # 'executive', 'technical', 'creative', 'concise'

class AIOptimizeBulletRequest(BaseModel):
    bullet_point: str
    target_role: Optional[str] = None
    industry: Optional[str] = None

class AISkillRecommendationRequest(BaseModel):
    current_skills: List[str]
    target_role: str
    job_description: Optional[str] = None

class AICoverLetterRequest(BaseModel):
    job_title: str
    company_name: str
    job_description: Optional[str] = None
    resume_id: Optional[int] = None
    resume_content: Optional[Dict[str, Any]] = None
    tone: Optional[str] = "professional"

class AIResponse(BaseModel):
    success: bool
    result: Any
    suggestions: List[str] = []
    metadata: Dict[str, Any] = {}
