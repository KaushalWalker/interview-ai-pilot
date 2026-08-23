from fastapi import FastAPI

from app.core.config import settings
from app.database.database import Base, engine
from app.api import analysis, auth, evaluation, interview, resume, users

from fastapi.middleware.cors import CORSMiddleware

import app.models


# Create database tables
Base.metadata.create_all(bind=engine)


# Create FastAPI application
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
)


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Users
app.include_router(
    users.router,
    prefix="/api/v1/users",
    tags=["Users"],
)


# Interview Evaluation
app.include_router(
    evaluation.router,
    prefix="/api/v1/interview",
    tags=["Interview Evaluation"],
)


# Authentication
app.include_router(
    auth.router,
    prefix="/api/v1/auth",
    tags=["Authentication"],
)


# Resume
app.include_router(
    resume.router,
    prefix="/api/v1/resume",
    tags=["Resume"],
)


# Resume Analysis
app.include_router(
    analysis.router,
    prefix="/api/v1/resume",
    tags=["Resume Analysis"],
)


# Interview
app.include_router(
    interview.router,
    prefix="/api/v1/interview",
    tags=["Interview"],
)


# Interview Evaluation
app.include_router(
    evaluation.router,
    prefix="/api/v1/interview",
    tags=["Interview Evaluation"],
)


@app.get("/")
def root():
    return {
        "project": settings.PROJECT_NAME,
        "version": settings.PROJECT_VERSION,
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "database": settings.DATABASE_URL,
    }