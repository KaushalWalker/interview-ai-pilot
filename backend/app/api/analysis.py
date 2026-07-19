from fastapi import APIRouter, Depends

from app.auth.dependencies import get_current_user
from app.models.user import User
from app.schemas.analysis import ResumeAnalysisRequest, ResumeAnalysisResponse
from app.services.analysis_service import analyze_resume


router = APIRouter()


@router.post("/analyze", response_model=ResumeAnalysisResponse)
def analyze_resume_endpoint(
    request: ResumeAnalysisRequest,
    current_user: User = Depends(get_current_user),
) -> ResumeAnalysisResponse:
    del current_user
    return analyze_resume(request)
