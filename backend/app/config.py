import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Lost & Found Assistant"
    API_V1_STR: str = "/api/v1"
    
    # Security / Auth
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-key-change-in-production-123456789")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./sql_app.db")
    
    # Storage
    UPLOAD_DIR: str = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "uploads"))
    
    # Email SMTP Settings (optional, log warning if invalid)
    SMTP_HOST: str = os.getenv("SMTP_HOST", "")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USERNAME: str = os.getenv("SMTP_USERNAME", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    EMAIL_FROM: str = os.getenv("EMAIL_FROM", "noreply@lostfound.edu")
    
    # AI Config & Scoring Weights (configurable)
    WEIGHT_TEXT: float = 0.40
    WEIGHT_IMAGE: float = 0.30
    WEIGHT_CATEGORY: float = 0.15
    WEIGHT_LOCATION: float = 0.10
    WEIGHT_DATE: float = 0.05
    
    # Thresholds
    HIGH_CONFIDENCE_THRESHOLD: float = 75.0
    MEDIUM_CONFIDENCE_THRESHOLD: float = 50.0
    MINIMUM_MATCH_THRESHOLD: float = 40.0

    class Config:
        case_sensitive = True

settings = Settings()

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
