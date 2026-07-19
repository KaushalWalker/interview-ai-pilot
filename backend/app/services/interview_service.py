import json

from fastapi import HTTPException, status
from pydantic import ValidationError

from app.schemas.analysis import ResumeAnalysisResponse
from app.schemas.interview import InterviewQuestionsResponse


def generate_interview_questions(
    analysis: ResumeAnalysisResponse,
) -> InterviewQuestionsResponse:
    from openai import OpenAI

    from app.core.config import settings

    if not settings.OPENAI_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AI interview generation is not configured",
        )

    prompt = (
        "Generate exactly 10 interview questions based on this resume analysis. "
        "Mix questions across Python, Machine Learning, FastAPI, SQL, Projects, "
        "and Behavioral categories. Include a balanced mix of easy, medium, and "
        "hard difficulties. Each expected answer should be concise and useful to "
        "an interviewer. Return only the requested structured data.\n\n"
        f"Resume analysis:\n{analysis.model_dump_json()}"
    )

    try:
        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        response = client.responses.create(
            model="gpt-4o-mini",
            input=prompt,
            text={
                "format": {
                    "type": "json_schema",
                    "name": "interview_questions",
                    "strict": True,
                    "schema": {
                        "type": "object",
                        "properties": {
                            "questions": {
                                "type": "array",
                                "minItems": 10,
                                "maxItems": 10,
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "question": {"type": "string"},
                                        "difficulty": {"type": "string"},
                                        "category": {"type": "string"},
                                        "expected_answer": {"type": "string"},
                                    },
                                    "required": [
                                        "question",
                                        "difficulty",
                                        "category",
                                        "expected_answer",
                                    ],
                                    "additionalProperties": False,
                                },
                            }
                        },
                        "required": ["questions"],
                        "additionalProperties": False,
                    },
                }
            },
        )

        return InterviewQuestionsResponse.model_validate(
            json.loads(response.output_text)
        )
    except (json.JSONDecodeError, ValidationError) as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Unable to parse interview question response",
        ) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Unable to generate interview questions at this time",
        ) from exc
