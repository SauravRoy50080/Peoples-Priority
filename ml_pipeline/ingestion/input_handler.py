"""
backend/routes/submit.py
POST /submit — citizen submits a complaint via text, voice, or photo.
WhatsApp/SMS go through webhook.py instead, since those arrive as
Twilio form-encoded callbacks, not direct API calls.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import structlog

from backend.services.pipeline_trigger import process_submission, ingest_and_process

log = structlog.get_logger()
router = APIRouter()


class SubmitRequest(BaseModel):
    input_type: str = "text"          # text | voice | photo
    content: Optional[str] = None     # used when input_type == "text"
    audio_data: Optional[str] = None  # used when input_type == "voice"
                                       # (mock: plain text stand-in for audio bytes;
                                       #  production: base64-encoded audio)
    image_data: Optional[str] = None  # used when input_type == "photo"
                                       # (mock: plain text stand-in for image bytes;
                                       #  production: base64-encoded image)
    ward: str = "Unknown"
    citizen_id: Optional[str] = None
    language: str = "en"


class SubmitResponse(BaseModel):
    submission_id: str
    category: str
    urgency: str
    summary: str


@router.post("/submit", response_model=SubmitResponse)
async def submit_complaint(payload: SubmitRequest):
    """
    Accepts a citizen complaint in any channel (text/voice/photo), normalizes
    it through Layer 1 if needed, classifies via Gemini (Layer 2), and stores
    it (Layer 3). Returns the classification result.
    """
    try:
        if payload.input_type == "text":
            if not payload.content or not payload.content.strip():
                raise HTTPException(status_code=400, detail="Complaint text cannot be empty")

            record = process_submission(
                raw_text=payload.content,
                ward=payload.ward,
                input_type="text",
                citizen_id=payload.citizen_id,
            )

        elif payload.input_type in ("voice", "photo"):
            raw = {
                "type": payload.input_type,
                "audio_data": payload.audio_data,
                "image_data": payload.image_data,
                "ward": payload.ward,
                "citizen_id": payload.citizen_id,
                "language": payload.language,
            }
            record = await ingest_and_process(raw)

        else:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported input_type '{payload.input_type}'. Use text, voice, or photo."
            )

    except ValueError as e:
        log.error("Submission classification failed", error=str(e))
        raise HTTPException(status_code=502, detail=f"Classification failed: {e}")
    except RuntimeError as e:
        log.error("Gemini API error", error=str(e))
        raise HTTPException(status_code=503, detail=f"AI service unavailable: {e}")

    return SubmitResponse(
        submission_id=record["submission_id"],
        category=record["category"],
        urgency=record["urgency"],
        summary=record["summary"],
    )
