from google import genai
from google.genai import types
import json

from .prompt_templates import CLASSIFICATION_PROMPT
from .response_validator import ComplaintResponse

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

# Create Gemini client
client = genai.Client(api_key=GEMINI_API_KEY)
# if error occurs it will retry 3 times after error
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
        Validated complaint as a Python dictionary.
    """

    prompt = f"{CLASSIFICATION_PROMPT}\n{complaint}"

    try:
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=GEMINI_TEMPERATURE,
                top_p=GEMINI_TOP_P,
                top_k=GEMINI_TOP_K,
                max_output_tokens=GEMINI_MAX_OUTPUT_TOKENS,
                response_mime_type="application/json",
                thinking_config=types.ThinkingConfig(
                    thinking_budget=248
                ),
            ),
        )
        # Preferred Method
        # Gemini already parsed the JSON into ComplaintResponse

        if response.parsed is not None:

            if isinstance(response.parsed, ComplaintResponse):
                return response.parsed.model_dump()

            elif isinstance(response.parsed, dict):
                validated = ComplaintResponse(**response.parsed)
                return validated.model_dump()

        # Fallback
        # Parse JSON manually

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