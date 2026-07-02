"""
backend/routes/submit.py
POST /submit — citizen submits a complaint via multipart/form-data
(matching the React frontend's submitEntry() in api.js).
"""

from fastapi import APIRouter, Form, UploadFile, File, HTTPException
from typing import List, Optional
from pydantic import BaseModel
import structlog

from backend.services.pipeline_trigger import process_submission

log = structlog.get_logger()
router = APIRouter()


class SubmitResponse(BaseModel):
    submission_id: str
    category: str
    urgency: str
    summary: str


@router.post("/submit", response_model=SubmitResponse)
async def submit_complaint(
    text: Optional[str] = Form(None),
    language: Optional[str] = Form("en"),
    lat: Optional[float] = Form(None),
    lng: Optional[float] = Form(None),
    photos: Optional[List[UploadFile]] = File(None),
    audio: Optional[UploadFile] = File(None),
):
    """
    Accepts a citizen complaint from the React frontend (multipart/form-data),
    runs it through Gemini classification (Layer 2), stores it (Layer 3),
    and returns the classification result.
    """
    if not text or not text.strip():
        raise HTTPException(status_code=400, detail="Complaint text cannot be empty")

    # Derive ward from coords if available, else default
    ward = f"{lat:.4f},{lng:.4f}" if lat and lng else "Unknown"

    try:
        record = process_submission(
            raw_text=text.strip(),
            ward=ward,
            input_type="text",
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
