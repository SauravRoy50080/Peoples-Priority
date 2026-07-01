"""
Layer 1: Input Ingestion & Normalization
Handles: voice, text, photo, WhatsApp/SMS → unified English text + metadata.
Output feeds into pipeline_trigger.process_submission().
"""

import uuid
from datetime import datetime
from typing import Dict, Any

TRANSLATION_MAP = {
    "सड़क टूटी है": "The road is broken",
    "पानी नहीं आ रहा": "Water is not coming",
    "स्कूल की छत टूटी है": "School roof is broken",
    "अस्पताल दूर है": "Hospital is far away",
    "फसल खराब हो रही है": "Crops are getting damaged",
}


class InputHandler:
    def __init__(self, use_mock: bool = True):
        self.use_mock = use_mock

    async def normalize(self, raw: Dict[str, Any]) -> Dict[str, Any]:
        input_type = raw.get("type", "text")

        if input_type == "voice":
            transcribed = self._stt(raw.get("audio_data", ""))
        elif input_type == "photo":
            transcribed = self._vision_describe(raw.get("image_data", ""))
        else:
            transcribed = raw.get("content", "")

        english_text = self._translate(transcribed, raw.get("language", "en"))

        return {
            "submission_id": str(uuid.uuid4()),
            "citizen_id": raw.get("citizen_id") or f"cit_{uuid.uuid4().hex[:8]}",
            "input_type": input_type,
            "raw_text": english_text,
            "ward": raw.get("ward", "Unknown"),
            "timestamp": raw.get("timestamp", datetime.utcnow().isoformat()),
        }

    def _stt(self, audio_data: str) -> str:
        if not self.use_mock:
            from google.cloud import speech
            client = speech.SpeechClient()
            audio = speech.RecognitionAudio(content=audio_data)
            config = speech.RecognitionConfig(
                encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
                language_code="hi-IN",
                alternative_language_codes=["en-IN"],
            )
            response = client.recognize(config=config, audio=audio)
            return response.results[0].alternatives[0].transcript
        return audio_data if audio_data else "Road near my house is broken since 3 months"

    def _vision_describe(self, image_data: str) -> str:
        if not self.use_mock:
            import google.generativeai as genai
            model = genai.GenerativeModel("gemini-1.5-pro")
            response = model.generate_content(
                [image_data, "Describe the public infrastructure issue in this image"]
            )
            return response.text
        return image_data if image_data else "Image shows a broken road with large potholes"

    def _translate(self, text: str, language: str) -> str:
        if not self.use_mock:
            from google.cloud import translate_v2 as translate
            client = translate.Client()
            result = client.translate(text, target_language="en")
            return result["translatedText"]
        return TRANSLATION_MAP.get(text, text)