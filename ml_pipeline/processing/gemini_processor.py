import json

import google.generativeai as genai
from pydantic import ValidationError
from tenacity import retry, stop_after_attempt, wait_exponential

try:
    from ml_pipeline.processing.prompt_templates import CLASSIFICATION_PROMPT
    from ml_pipeline.processing.response_validator import ComplaintResponse
except ImportError:
    from processing.prompt_templates import CLASSIFICATION_PROMPT
    from processing.response_validator import ComplaintResponse

try:
    from config.settings import (
        GEMINI_API_KEY,
        GEMINI_MODEL,
        GEMINI_TEMPERATURE,
        GEMINI_TOP_P,
        GEMINI_TOP_K,
        GEMINI_MAX_OUTPUT_TOKENS,
    )
except ImportError:
    from ml_pipeline.config.settings import (
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

        try:
            data = json.loads(text)
        except json.JSONDecodeError:
            # Try to salvage a JSON substring in case the model added
            # extra commentary before/after the JSON object. Search for
            # a balanced braces substring to handle nested objects.
            start_idx = None
            brace_count = 0
            candidate = None
            for i, ch in enumerate(text):
                if ch == '{':
                    if start_idx is None:
                        start_idx = i
                    brace_count += 1
                elif ch == '}':
                    brace_count -= 1
                    if start_idx is not None and brace_count == 0:
                        candidate = text[start_idx:i+1]
                        break

            if candidate:
                data = json.loads(candidate)
            else:
                raise

        validated = ComplaintResponse(**data)
        return validated.model_dump(mode="json")

    except ValidationError as e:
        raise ValueError(f"Response validation failed:\n{e}") from e

    except Exception as e:
        # As a last resort, provide a simple deterministic fallback
        # classifier so the system remains functional when the LLM fails.
        print("Gemini API error, using fallback classifier:", e)
        text_lower = complaint.lower()
        if "pothole" in text_lower or "road" in text_lower or "street" in text_lower:
            category = "Road"
            urgency = "High"
            issue_type = "pothole" if "pothole" in text_lower else None
        elif "water" in text_lower or "drinking" in text_lower:
            category = "Water"
            urgency = "Medium"
            issue_type = None
        else:
            category = "Other"
            urgency = "Low"
            issue_type = None

        summary = complaint.strip().replace("\n", " ")
        if len(summary.split()) > 20:
            summary = " ".join(summary.split()[:20])

        fallback = {
            "category": category,
            "urgency": urgency,
            "summary": summary,
            "entities": {
                "issue_type": issue_type,
                "facility": None,
                "duration": None,
                "location_mentioned": None,
            },
        }

        try:
            validated = ComplaintResponse(**fallback)
            return validated.model_dump(mode="json")
        except Exception:
            # If validation fails for any reason, raise original error
            raise RuntimeError(f"Gemini API Error: {e}") from e