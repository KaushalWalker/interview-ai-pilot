from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.dependencies import get_db
from app.schemas.auth import LoginRequest, TokenResponse
from app.services.auth_service import login_user


router = APIRouter()


@router.post("/login", response_model=TokenResponse)
def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db),
) -> TokenResponse:
    return login_user(db, login_data)
