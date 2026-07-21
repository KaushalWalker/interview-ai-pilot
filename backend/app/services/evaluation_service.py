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
        "Act as a rigorous Senior Software Engineering interviewer. Evaluate the "
        "candidate's answer against the expected answer. Score each dimension from "
        "0 to 100: overall_score, technical_accuracy, communication, problem_solving, "
        "and confidence. Identify exactly which concepts were missed and explicitly "
        "call out incorrect statements. Explain why the score was given. Generate one "
        "realistic follow-up interview question. Keep feedback, interviewer_notes, "
        "and ideal_answer concise but useful. Use one of: Strong Hire, Hire, "
        "Borderline, No Hire. Return only the requested structured data.\n\n"
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
                            "overall_score": {"type": "integer", "minimum": 0, "maximum": 100},
                            "technical_accuracy": {"type": "integer", "minimum": 0, "maximum": 100},
                            "communication": {"type": "integer", "minimum": 0, "maximum": 100},
                            "problem_solving": {"type": "integer", "minimum": 0, "maximum": 100},
                            "confidence": {"type": "integer", "minimum": 0, "maximum": 100},
                            "strengths": {
                                "type": "array",
                                "items": {"type": "string"},
                            },
                            "improvements": {
                                "type": "array",
                                "items": {"type": "string"},
                            },
                            "missed_points": {
                                "type": "array",
                                "items": {"type": "string"},
                            },
                            "follow_up_question": {"type": "string"},
                            "feedback": {"type": "string"},
                            "ideal_answer": {"type": "string"},
                            "interviewer_notes": {"type": "string"},
                            "hire_recommendation": {
                                "type": "string",
                                "enum": ["Strong Hire", "Hire", "Borderline", "No Hire"],
                            },
                        },
                        "required": [
                            "overall_score",
                            "technical_accuracy",
                            "communication",
                            "problem_solving",
                            "confidence",
                            "strengths",
                            "improvements",
                            "missed_points",
                            "follow_up_question",
                            "feedback",
                            "ideal_answer",
                            "interviewer_notes",
                            "hire_recommendation",
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
