"""
backend/routes/submit.py
POST /submit — citizen submits a complaint (text for now; voice/photo handled
by ingestion layer before reaching here).
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import structlog

from backend.services.pipeline_trigger import process_submission

log = structlog.get_logger()
router = APIRouter()


class SubmitRequest(BaseModel):
    text: str
    ward: str = "Unknown"
    input_type: str = "text"          # text | voice | photo | whatsapp | sms
    citizen_id: str | None = None


class SubmitResponse(BaseModel):
    submission_id: str
    category: str
    urgency: str
    summary: str


@router.post("/submit", response_model=SubmitResponse)
async def submit_complaint(payload: SubmitRequest):
    """
    Accepts a citizen complaint, runs it through Gemini classification
    (Layer 2), stores it (Layer 3), and returns the classification result.
    """
    if not payload.text or not payload.text.strip():
        raise HTTPException(status_code=400, detail="Complaint text cannot be empty")

    try:
        record = process_submission(
            raw_text=payload.text,
            ward=payload.ward,
            input_type=payload.input_type,
            citizen_id=payload.citizen_id,
        )
    except ValueError as e:
        # Gemini returned invalid/unparseable JSON or failed validation
        log.error("Submission classification failed", error=str(e))
        raise HTTPException(status_code=502, detail=f"Classification failed: {e}")
    except RuntimeError as e:
        # Gemini API error (network, quota, auth)
        log.error("Gemini API error", error=str(e))
        raise HTTPException(status_code=503, detail=f"AI service unavailable: {e}")

    return SubmitResponse(
        submission_id=record["submission_id"],
        category=record["category"],
        urgency=record["urgency"],
        summary=record["summary"],
    )

