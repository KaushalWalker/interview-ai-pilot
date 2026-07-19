from pydantic import BaseModel, Field


class AnswerEvaluationRequest(BaseModel):
    question: str = Field(min_length=1)
    expected_answer: str = Field(min_length=1)
    candidate_answer: str = Field(min_length=1)


class AnswerEvaluationResponse(BaseModel):
    score: int = Field(ge=0, le=100)
    strengths: list[str]
    improvements: list[str]
    feedback: str
    ideal_answer: str
