import google.generativeai as genai
from processing.prompt_templates import CLASSIFICATION_PROMPT
import json
from processing.response_validator import ComplaintResponse
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

genai.configure(api_key=GEMINI_API_KEY)

generation_config = genai.types.GenerationConfig(
    temperature=GEMINI_TEMPERATURE,
    top_p=GEMINI_TOP_P,
    top_k=GEMINI_TOP_K,
    max_output_tokens=GEMINI_MAX_OUTPUT_TOKENS,
)

model = genai.GenerativeModel(
    GEMINI_MODEL,
    generation_config=generation_config,
)

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10),
    reraise=True,
)

def classify_complaint(complaint: str) -> dict:
    """
    Classify a citizen complaint using Gemini.

    Args:
        complaint: Complaint text.

    Returns:
        Parsed and validated complaint as a Python dictionary.
    """

    prompt = f"{CLASSIFICATION_PROMPT}\n{complaint}"

    try:
        response = model.generate_content(prompt)

        text = response.text.strip()

        data = json.loads(text)

        validated = ComplaintResponse(**data)
        return validated.model_dump(mode="json")

    except json.JSONDecodeError as e:
        print("=" * 80)
        print("Gemini returned invalid JSON")
        print(response.text)
        print("=" * 80)
        raise ValueError("Gemini returned invalid JSON.") from e

    except ValidationError as e:
        raise ValueError(f"Response validation failed:\n{e}") from e

    except Exception as e:
        raise RuntimeError(f"Gemini API Error: {e}") from e