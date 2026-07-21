from typing import Literal

from pydantic import BaseModel, Field


class AnswerEvaluationRequest(BaseModel):
    question: str = Field(min_length=1)
    expected_answer: str = Field(min_length=1)
    candidate_answer: str = Field(min_length=1)


class AnswerEvaluationResponse(BaseModel):
    overall_score: int = Field(ge=0, le=100)
    technical_accuracy: int = Field(ge=0, le=100)
    communication: int = Field(ge=0, le=100)
    problem_solving: int = Field(ge=0, le=100)
    confidence: int = Field(ge=0, le=100)
    strengths: list[str]
    improvements: list[str]
    missed_points: list[str]
    follow_up_question: str
    feedback: str
    ideal_answer: str
    interviewer_notes: str
    hire_recommendation: Literal["Strong Hire", "Hire", "Borderline", "No Hire"]
