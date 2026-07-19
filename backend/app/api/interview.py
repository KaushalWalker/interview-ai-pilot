from fastapi import APIRouter, Depends

from app.auth.dependencies import get_current_user
from app.models.user import User
from app.schemas.interview import (
    InterviewQuestionsRequest,
    InterviewQuestionsResponse,
)
from app.services.interview_service import generate_interview_questions


router = APIRouter()


@router.post("/questions", response_model=InterviewQuestionsResponse)
def generate_questions(
    analysis: InterviewQuestionsRequest,
    current_user: User = Depends(get_current_user),
) -> InterviewQuestionsResponse:
    del current_user
    return generate_interview_questions(analysis)
