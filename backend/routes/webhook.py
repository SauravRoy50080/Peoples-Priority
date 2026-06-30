"""
backend/routes/webhook.py
POST /webhook/wa, POST /webhook/sms — Twilio inbound message receivers.
Both funnel into the same process_submission() used by /submit.
"""

from fastapi import APIRouter, Form
from fastapi.responses import PlainTextResponse
import structlog

from backend.services.pipeline_trigger import process_submission

log = structlog.get_logger()
router = APIRouter()


@router.post("/wa")
async def whatsapp_webhook(
    Body: str = Form(...),
    From: str = Form(...),
):
    """
    Twilio WhatsApp webhook. Twilio sends form-encoded data with at least
    Body (message text) and From (sender's whatsapp:+91... number).
    """
    log.info("WhatsApp message received", from_number=From)

    try:
        record = process_submission(
            raw_text=Body,
            input_type="whatsapp",
            citizen_id=From,
        )
        log.info("WhatsApp complaint processed",
                  submission_id=record["submission_id"],
                  category=record["category"])
    except Exception as e:
        log.error("WhatsApp processing failed", error=str(e))
        return PlainTextResponse("", status_code=200)

    return PlainTextResponse("", status_code=200)


@router.post("/sms")
async def sms_webhook(
    Body: str = Form(...),
    From: str = Form(...),
):
    """Twilio SMS webhook — same shape as WhatsApp."""
    log.info("SMS received", from_number=From)

    try:
        record = process_submission(
            raw_text=Body,
            input_type="sms",
            citizen_id=From,
        )
        log.info("SMS complaint processed",
                  submission_id=record["submission_id"],
                  category=record["category"])
    except Exception as e:
        log.error("SMS processing failed", error=str(e))
        return PlainTextResponse("", status_code=200)

    return PlainTextResponse("", status_code=200)
