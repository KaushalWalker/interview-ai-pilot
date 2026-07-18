from fastapi import HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.auth.jwt import create_access_token
from app.auth.security import verify_password
from app.models.user import User
from app.schemas.auth import TokenResponse


def login_user(
    db: Session,
    form_data: OAuth2PasswordRequestForm,
) -> TokenResponse:

    user = db.query(User).filter(
        User.email == form_data.username
    ).first()

    if user is None or not verify_password(
        form_data.password,
        user.hashed_password,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return TokenResponse(
        access_token=create_access_token(user.id)
    )