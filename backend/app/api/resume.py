from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status

from app.auth.dependencies import get_current_user
from app.models.user import User
from app.schemas.resume import ResumeResponse
from app.services.resume_service import extract_resume_text


router = APIRouter()


@router.post(
    "/upload",
    response_model=ResumeResponse,
    status_code=status.HTTP_200_OK,
)
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
) -> ResumeResponse:
    del current_user

    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file must be a PDF",
        )

    content = await file.read()
    pages, text = extract_resume_text(content)
    return ResumeResponse(filename=file.filename or "", pages=pages, text=text)
