from pydantic import BaseModel, Field


class ResumeAnalysisRequest(BaseModel):
    resume_text: str = Field(min_length=1)


class ResumeAnalysisResponse(BaseModel):
    skills: list[str]
    projects: list[str]
    experience: list[str]
    strengths: list[str]
    improvement_areas: list[str]
    summary: str
