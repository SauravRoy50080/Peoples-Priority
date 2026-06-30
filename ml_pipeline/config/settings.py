"""
config/settings.py
Flat constants loaded from .env — matches the pattern used in ml_pipeline/processing/gemini_processor.py
"""

import os
from dotenv import load_dotenv

load_dotenv()

# ── Gemini ───────────────────────────────────────────────────
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "models/gemini-2.5-flash")
GEMINI_TEMPERATURE = float(os.getenv("GEMINI_TEMPERATURE", "0.1"))
GEMINI_TOP_P = float(os.getenv("GEMINI_TOP_P", "0.8"))
GEMINI_TOP_K = int(os.getenv("GEMINI_TOP_K", "10"))
GEMINI_MAX_OUTPUT_TOKENS = int(os.getenv("GEMINI_MAX_OUTPUT_TOKENS", "512"))

# ── Google Cloud ─────────────────────────────────────────────
GOOGLE_CLOUD_PROJECT = os.getenv("GOOGLE_CLOUD_PROJECT", "")
GOOGLE_CLOUD_REGION = os.getenv("GOOGLE_CLOUD_REGION", "us-central1")
GOOGLE_APPLICATION_CREDENTIALS = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "./config/service-account.json")

# ── BigQuery ─────────────────────────────────────────────────
BQ_DATASET = os.getenv("BQ_DATASET", "peoples_priority")
BQ_TABLE_SUBMISSIONS = os.getenv("BQ_TABLE_SUBMISSIONS", "submissions")
BQ_TABLE_CLUSTERS = os.getenv("BQ_TABLE_CLUSTERS", "clusters")
BQ_TABLE_SCORES = os.getenv("BQ_TABLE_SCORES", "priority_scores")
BQ_SUBMISSIONS_TABLE_ID = f"{GOOGLE_CLOUD_PROJECT}.{BQ_DATASET}.{BQ_TABLE_SUBMISSIONS}"
BQ_CLUSTERS_TABLE_ID = f"{GOOGLE_CLOUD_PROJECT}.{BQ_DATASET}.{BQ_TABLE_CLUSTERS}"
BQ_SCORES_TABLE_ID = f"{GOOGLE_CLOUD_PROJECT}.{BQ_DATASET}.{BQ_TABLE_SCORES}"

# ── Firebase ─────────────────────────────────────────────────
FIREBASE_DATABASE_URL = os.getenv("FIREBASE_DATABASE_URL", "")
FIREBASE_CREDENTIALS = os.getenv("FIREBASE_CREDENTIALS", "./config/firebase-service-account.json")

# ── Pub/Sub ──────────────────────────────────────────────────
PUBSUB_TOPIC_INGESTION = os.getenv("PUBSUB_TOPIC_INGESTION", "citizen-submissions")
PUBSUB_TOPIC_PROCESSED = os.getenv("PUBSUB_TOPIC_PROCESSED", "processed-submissions")
PUBSUB_SUBSCRIPTION = os.getenv("PUBSUB_SUBSCRIPTION", "pipeline-processor")

# ── Twilio ───────────────────────────────────────────────────
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID", "")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN", "")
TWILIO_WHATSAPP_NUMBER = os.getenv("TWILIO_WHATSAPP_NUMBER", "")
TWILIO_SMS_NUMBER = os.getenv("TWILIO_SMS_NUMBER", "")

# ── App ──────────────────────────────────────────────────────
APP_ENV = os.getenv("APP_ENV", "development")
APP_PORT = int(os.getenv("APP_PORT", "8000"))
APP_SECRET_KEY = os.getenv("APP_SECRET_KEY", "dev-secret")
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
IS_PRODUCTION = APP_ENV == "production"

# ── Scoring Weights ──────────────────────────────────────────
WEIGHT_DEMAND = float(os.getenv("WEIGHT_DEMAND", "0.35"))
WEIGHT_NEED = float(os.getenv("WEIGHT_NEED", "0.35"))
WEIGHT_URGENCY = float(os.getenv("WEIGHT_URGENCY", "0.20"))
WEIGHT_FEASIBILITY = float(os.getenv("WEIGHT_FEASIBILITY", "0.10"))

# ── Mock mode (no real GCP creds available) ──────────────────
USE_MOCK = os.getenv("USE_MOCK", "true").lower() == "true"
