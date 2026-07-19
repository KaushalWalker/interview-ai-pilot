from pydantic import BaseModel


class ResumeResponse(BaseModel):
    filename: str
    pages: int
    text: str
