import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent

load_dotenv(BASE_DIR / "configuration.env")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL")

GEMINI_TEMPERATURE = float(os.getenv("GEMINI_TEMPERATURE", 0.1))
GEMINI_TOP_P = float(os.getenv("GEMINI_TOP_P", 0.9))
GEMINI_TOP_K = int(os.getenv("GEMINI_TOP_K", 40))
GEMINI_MAX_OUTPUT_TOKENS = int(os.getenv("GEMINI_MAX_OUTPUT_TOKENS", 1256))