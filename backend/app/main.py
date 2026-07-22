from fastapi import FastAPI
from app.core.config import settings
from app.database.database import Base, engine
from app.api import analysis, auth, evaluation, interview, resume, users
from app.api import evaluation
from fastapi.middleware.cors import CORSMiddleware

import app.models

Base.metadata.create_all(bind=engine)  # creating database


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,   
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://interview-ai-pilot-dcpridgta-walker11.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    users.router,
    prefix="/api/v1/users",
    tags=["Users"],
)

app.include_router(
    evaluation.router,
    prefix="/api/v1/interview",
    tags=["Interview Evaluation"],
)

app.include_router(
    auth.router,
    prefix="/api/v1/auth",
    tags=["Authentication"],
)

app.include_router(
    resume.router,
    prefix="/api/v1/resume",
    tags=["Resume"],
)

app.include_router(
    analysis.router,
    prefix="/api/v1/resume",
    tags=["Resume Analysis"],
)

app.include_router(
    interview.router,
    prefix="/api/v1/interview",
    tags=["Interview"],
)

app.include_router(
    evaluation.router,
    prefix="/api/v1/interview",
    tags=["Interview Evaluation"],
)


@app.get("/")
def root():
    return{
        "project": settings.PROJECT_NAME,
        "version": settings.PROJECT_VERSION,
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "database": settings.DATABASE_URL,
    }

