import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "ATS Resume AI Platform"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-key-change-in-production-12345678")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./ats_resume_builder.db")
    
    # AI Settings
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "openai")
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY", None)
    AI_MODEL_NAME: str = os.getenv("AI_MODEL_NAME", "gpt-4o-mini")
    AI_FALLBACK_TO_HEURISTICS: bool = True
    
    # Upload storage
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "./uploads")
    MAX_FILE_SIZE_MB: int = 10
    
    # Admin default setup
    FIRST_SUPERUSER_EMAIL: str = "admin@atsresume.ai"
    FIRST_SUPERUSER_PASSWORD: str = "Admin@123456"

    class Config:
        case_sensitive = True

settings = Settings()
