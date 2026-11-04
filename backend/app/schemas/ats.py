from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class ATSCheckRequest(BaseModel):
    resume_id: Optional[int] = None
    resume_content: Optional[Dict[str, Any]] = None
    job_title: Optional[str] = None
    job_description: Optional[str] = None

class FormattingWarning(BaseModel):
    category: str
    severity: str # 'error', 'warning', 'info'
    message: str
    fix_suggestion: str

class Recommendation(BaseModel):
    title: str
    description: str
    impact: str # 'high', 'medium', 'low'

class ATSCheckResponse(BaseModel):
    overall_score: int
    keyword_match_pct: int
    structure_score: int
    skills_score: int
    formatting_score: int
    impact_score: int
    
    found_keywords: List[str]
    missing_keywords: List[str]
    formatting_warnings: List[FormattingWarning]
    recommendations: List[Recommendation]
    summary_evaluation: str
