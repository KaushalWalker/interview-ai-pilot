import json

from fastapi import HTTPException, status
from pydantic import ValidationError

from app.schemas.evaluation import (
    AnswerEvaluationRequest,
    AnswerEvaluationResponse,
)


def evaluate_answer(
    request: AnswerEvaluationRequest,
) -> AnswerEvaluationResponse:
    from openai import OpenAI

    from app.core.config import settings

    if not settings.OPENAI_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AI answer evaluation is not configured",
        )

    prompt = (
        "Evaluate the candidate's answer against the expected answer for the "
        "interview question. Score it from 0 to 100 based on correctness, "
        "completeness, and clarity. Keep feedback and ideal_answer concise. "
        "Return only the requested structured data.\n\n"
        f"Question:\n{request.question}\n\n"
        f"Expected answer:\n{request.expected_answer}\n\n"
        f"Candidate answer:\n{request.candidate_answer}"
    )

    try:
        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        response = client.responses.create(
            model="gpt-4o-mini",
            input=prompt,
            text={
                "format": {
                    "type": "json_schema",
                    "name": "answer_evaluation",
                    "strict": True,
                    "schema": {
                        "type": "object",
                        "properties": {
                            "score": {"type": "integer", "minimum": 0, "maximum": 100},
                            "strengths": {
                                "type": "array",
                                "items": {"type": "string"},
                            },
                            "improvements": {
                                "type": "array",
                                "items": {"type": "string"},
                            },
                            "feedback": {"type": "string"},
                            "ideal_answer": {"type": "string"},
                        },
                        "required": [
                            "score",
                            "strengths",
                            "improvements",
                            "feedback",
                            "ideal_answer",
                        ],
                        "additionalProperties": False,
                    },
                }
            },
        )

        return AnswerEvaluationResponse.model_validate(
            json.loads(response.output_text)
        )
    except (json.JSONDecodeError, ValidationError) as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Unable to parse answer evaluation response",
        ) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Unable to evaluate answer at this time",
        ) from exc
