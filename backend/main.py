import sys
import os

# Ensure current and parent folders are on python path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PARENT_DIR = os.path.dirname(BASE_DIR)
for p in [BASE_DIR, PARENT_DIR]:
    if p not in sys.path:
        sys.path.insert(0, p)

import types
for pkg_name, dir_name in [
    ("document_processing", "document-processing"),
    ("ai_engine", "ai-engine"),
    ("template_engine", "template-engine")
]:
    pkg_dir = os.path.join(PARENT_DIR, dir_name)
    mod = types.ModuleType(pkg_name)
    mod.__path__ = [pkg_dir]
    sys.modules[pkg_name] = mod

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from backend.app.config import settings
from backend.app.database import engine, Base
from backend.app.api.v1 import auth, resumes, upload, templates, ats, ai, export, admin

# Automatically initialize database schema tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Production AI-Powered ATS Resume Builder Platform API",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable permissive CORS for frontend Vite development & production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register modular API routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(resumes.router, prefix=settings.API_V1_STR)
app.include_router(upload.router, prefix=settings.API_V1_STR)
app.include_router(templates.router, prefix=settings.API_V1_STR)
app.include_router(ats.router, prefix=settings.API_V1_STR)
app.include_router(ai.router, prefix=settings.API_V1_STR)
app.include_router(export.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)

# Ensure uploads directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

@app.get("/")
def root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs",
        "templates_available": 1260
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": "ok"}
