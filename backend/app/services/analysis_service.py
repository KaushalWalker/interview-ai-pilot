import json

from fastapi import HTTPException, status
from pydantic import ValidationError


from app.schemas.analysis import (
    ResumeAnalysisRequest,
    ResumeAnalysisResponse,
)


def analyze_resume(request: ResumeAnalysisRequest) -> ResumeAnalysisResponse:
    from openai import OpenAI

    from app.core.config import settings

    if not settings.OPENAI_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AI analysis is not configured",
        )

    prompt = (
        "Analyze the following resume and return only the requested structured data. "
        "Keep each list concise and grounded in the resume.\n\n"
        f"Resume:\n{request.resume_text}"
    )

    try:
        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        response = client.responses.create(
            model="gpt-4o-mini",
            input=prompt,
            text={
                "format": {
                    "type": "json_schema",
                    "name": "resume_analysis",
                    "strict": True,
                    "schema": {
                        "type": "object",
                        "properties": {
                            "skills": {
                                "type": "array",
                                "items": {"type": "string"},
                            },
                            "projects": {
                                "type": "array",
                                "items": {"type": "string"},
                            },
                            "experience": {
                                "type": "array",
                                "items": {"type": "string"},
                            },
                            "strengths": {
                                "type": "array",
                                "items": {"type": "string"},
                            },
                            "improvement_areas": {
                                "type": "array",
                                "items": {"type": "string"},
                            },
                            "summary": {"type": "string"},
                        },
                        "required": [
                            "skills",
                            "projects",
                            "experience",
                            "strengths",
                            "improvement_areas",
                            "summary",
                        ],
                        "additionalProperties": False,
                    },
                }
            },
        )

        return ResumeAnalysisResponse.model_validate(
            json.loads(response.output_text)
        )
    except (json.JSONDecodeError, ValidationError) as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Unable to parse resume analysis response",
        ) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Unable to analyze resume at this time",
        ) from exc
