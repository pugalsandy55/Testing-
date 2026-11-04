from fastapi import APIRouter, Query
from typing import Optional, List, Dict, Any
from template_engine.generator import TemplateEngineGenerator

router = APIRouter(prefix="/templates", tags=["Template Marketplace"])

# Cache generated templates in memory for lightning-fast querying
ALL_TEMPLATES = TemplateEngineGenerator.generate_all_templates()

@router.get("")
def list_templates(
    category: Optional[str] = Query(None, description="Category filter"),
    industry: Optional[str] = Query(None, description="Industry filter"),
    search: Optional[str] = Query(None, description="Search term"),
    color: Optional[str] = Query(None, description="Color palette name"),
    is_premium: Optional[bool] = Query(None, description="Premium status"),
    is_ats_friendly: Optional[bool] = Query(None, description="ATS friendliness"),
    page: int = Query(1, ge=1),
    page_size: int = Query(24, ge=1, le=100)
):
    filtered = ALL_TEMPLATES

    if category and category != "all":
        filtered = [t for t in filtered if t["category_id"] == category or t["category"] == category]

    if industry and industry != "all":
        filtered = [t for t in filtered if t["industry"].lower() == industry.lower()]

    if color and color != "all":
        filtered = [t for t in filtered if t["style_config"]["palette_name"].lower() == color.lower()]

    if is_premium is not None:
        filtered = [t for t in filtered if t["is_premium"] == is_premium]

    if is_ats_friendly is not None:
        filtered = [t for t in filtered if t["is_ats_friendly"] == is_ats_friendly]

    if search:
        s = search.lower()
        filtered = [
            t for t in filtered
            if s in t["name"].lower()
            or s in t["category"].lower()
            or s in t["industry"].lower()
            or any(s in tag for tag in t["tags"])
        ]

    total_count = len(filtered)
    start_idx = (page - 1) * page_size
    end_idx = start_idx + page_size
    items = filtered[start_idx:end_idx]

    return {
        "total": total_count,
        "page": page,
        "page_size": page_size,
        "total_pages": (total_count + page_size - 1) // page_size,
        "templates": items
    }

@router.get("/categories")
def get_categories():
    return TemplateEngineGenerator.CATEGORIES

@router.get("/palettes")
def get_palettes():
    return TemplateEngineGenerator.COLOR_PALETTES

@router.get("/{template_id}")
def get_template(template_id: str):
    for t in ALL_TEMPLATES:
        if t["id"] == template_id:
            return t
    # Fallback to first template
    return ALL_TEMPLATES[0]
