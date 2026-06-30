import os

from ml_pipeline.config.settings import (
    GEMINI_API_KEY,
    GEMINI_MODEL,
    GEMINI_TEMPERATURE,
    GEMINI_TOP_P,
    GEMINI_TOP_K,
    GEMINI_MAX_OUTPUT_TOKENS,
)

APP_ENV = os.getenv("APP_ENV", "development")
APP_PORT = int(os.getenv("APP_PORT", "8000"))
IS_PRODUCTION = os.getenv("IS_PRODUCTION", "false").lower() in ("1", "true", "yes")
USE_MOCK = os.getenv("USE_MOCK", "true").lower() in ("1", "true", "yes")
