from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class TemplateResponse(BaseModel):
    id: str
    name: str
    category: str
    industry: str
    is_premium: bool
    is_ats_friendly: bool
    layout_config: Dict[str, Any]
    style_config: Dict[str, Any]
    tags: List[str]
    rating: str
    uses_count: int

    class Config:
        from_attributes = True

class TemplateFilter(BaseModel):
    category: Optional[str] = None
    industry: Optional[str] = None
    is_premium: Optional[bool] = None
    is_ats_friendly: Optional[bool] = None
    search: Optional[str] = None
    color: Optional[str] = None
    page: int = 1
    page_size: int = 24
