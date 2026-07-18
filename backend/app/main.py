from fastapi import FastAPI
from app.core.config import settings
from app.database.database import Base, engine
from app.api import users


import app.models

Base.metadata.create_all(bind=engine)  # creating database


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,   
)

app.include_router(
    users.router,
    prefix="/api/v1/users",
    tags=["Users"],
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

