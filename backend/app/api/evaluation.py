from fastapi import APIRouter, Depends

from app.auth.dependencies import get_current_user
from app.models.user import User
from app.schemas.evaluation import (
    AnswerEvaluationRequest,
    AnswerEvaluationResponse,
)
from app.services.evaluation_service import evaluate_answer


router = APIRouter()


@router.post("/evaluate", response_model=AnswerEvaluationResponse)
def evaluate_candidate_answer(
    request: AnswerEvaluationRequest,
    current_user: User = Depends(get_current_user),
) -> AnswerEvaluationResponse:
    del current_user
    return evaluate_answer(request)
