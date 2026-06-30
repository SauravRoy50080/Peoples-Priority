import json

import google.generativeai as genai
from pydantic import ValidationError
from tenacity import retry, stop_after_attempt, wait_exponential
from config.settings import (
    GEMINI_API_KEY,
    GEMINI_MODEL,
    GEMINI_TEMPERATURE,
    GEMINI_TOP_P,
    GEMINI_TOP_K,
    GEMINI_MAX_OUTPUT_TOKENS,
)
from ml_pipeline.processing.prompt_templates import CLASSIFICATION_PROMPT
from ml_pipeline.processing.response_validator import ComplaintResponse

_model = None


def _get_model():
    global _model
    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY is not configured")

    if _model is None:
        genai.configure(api_key=GEMINI_API_KEY)
        generation_config = genai.types.GenerationConfig(
            temperature=GEMINI_TEMPERATURE,
            top_p=GEMINI_TOP_P,
            top_k=GEMINI_TOP_K,
            max_output_tokens=GEMINI_MAX_OUTPUT_TOKENS,
        )
        _model = genai.GenerativeModel(
            GEMINI_MODEL,
            generation_config=generation_config,
        )

    return _model


@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10),
    reraise=True
)
def classify_complaint(complaint: str) -> dict:
    """
    Classify a citizen complaint using Gemini.

    Arguments:
        complaint: Complaint text.

    Returns:
        Parsed and validated complaint as a Python dictionary.    """

    prompt = CLASSIFICATION_PROMPT + f"\n{complaint}"

    try:
        model = _get_model()
        response = model.generate_content(prompt)

        text = response.text.strip()

        if text.startswith("```"):
            text = text.replace("```json", "")
            text = text.replace("```", "")
            text = text.strip()

        data = json.loads(text)

        # Validate the response using Pydantic in the response_validator
        validated = ComplaintResponse(**data)

        # Convert the validated model back to a dictionary
        return validated.model_dump()

    except json.JSONDecodeError:
        raise ValueError("Gemini returned invalid JSON.")
    
    except ValidationError as e:
        raise ValueError(f"Response validation failed: {e}") from e

    except Exception as e:
        raise RuntimeError(f"Gemini API Error: {e}") from e
