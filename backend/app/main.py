import os
import logging
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config import settings
from app.database import engine, Base, SessionLocal
from app.routes import auth, items, matches, admin
from app.models import User, RoleEnum
from app.utils.auth import get_password_hash

# Initialize logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("main")

# Create Database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Uploads static directory
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Register API Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(items.router, prefix=settings.API_V1_STR)
app.include_router(matches.router, prefix=settings.API_V1_STR)
app.include_router(admin.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "message": "Welcome to AI Lost & Found Assistant API",
        "docs": "/docs",
        "status": "active"
    }

@app.on_event("startup")
def create_initial_admin():
    db = SessionLocal()
    try:
        admin_email = "admin@lostfound.edu"
        existing_admin = db.query(User).filter(User.email == admin_email).first()
        if not existing_admin:
            admin_user = User(
                name="Office Admin",
                email=admin_email,
                password_hash=get_password_hash("Admin123!"),
                role=RoleEnum.ADMIN
            )
            db.add(admin_user)
            db.commit()
            logger.info("Created default admin user: admin@lostfound.edu / Admin123!")
    finally:
        db.close()
