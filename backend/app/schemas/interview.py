from pydantic import BaseModel, Field

from app.schemas.analysis import ResumeAnalysisResponse


class InterviewQuestion(BaseModel):
    question: str
    difficulty: str
    category: str
    expected_answer: str


class InterviewQuestionsResponse(BaseModel):
    questions: list[InterviewQuestion] = Field(min_length=10, max_length=10)


InterviewQuestionsRequest = ResumeAnalysisResponse
