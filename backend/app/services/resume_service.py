from io import BytesIO

import fitz
from fastapi import HTTPException, status


def extract_resume_text(content: bytes) -> tuple[int, str]:
    if not content.startswith(b"%PDF"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file must be a PDF",
        )

    try:
        document = fitz.open(stream=BytesIO(content), filetype="pdf")
    except (fitz.FileDataError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file must be a valid PDF",
        )

    try:
        text = "\n".join(page.get_text() for page in document)
        return document.page_count, text
    finally:
        document.close()
