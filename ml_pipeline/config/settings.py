import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent

load_dotenv(BASE_DIR / "configuration.env")
# Load .env from ml_pipeline/ (if present)
load_dotenv(BASE_DIR.parent / ".env", override=False)
# Also attempt to load the project root .env so values like GEMINI_API_KEY
# defined at the repository root are available when running the backend.
load_dotenv(BASE_DIR.parent.parent / ".env", override=False)
load_dotenv(BASE_DIR.parent / "ml_pipeline" / "config" / "configuration.env", override=False)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "models/gemini-2.5-flash")

GEMINI_TEMPERATURE = float(os.getenv("GEMINI_TEMPERATURE", 0.1))
GEMINI_TOP_P = float(os.getenv("GEMINI_TOP_P", 0.9))
GEMINI_TOP_K = int(os.getenv("GEMINI_TOP_K", 40))
GEMINI_MAX_OUTPUT_TOKENS = int(os.getenv("GEMINI_MAX_OUTPUT_TOKENS", 1256))

WEIGHT_DEMAND = float(os.getenv("WEIGHT_DEMAND", 0.35))
WEIGHT_NEED = float(os.getenv("WEIGHT_NEED", 0.35))
WEIGHT_URGENCY = float(os.getenv("WEIGHT_URGENCY", 0.20))
WEIGHT_FEASIBILITY = float(os.getenv("WEIGHT_FEASIBILITY", 0.10))