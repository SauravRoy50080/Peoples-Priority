"""
backend/services/pipeline_trigger.py
Glue layer between API routes and the ML pipeline.
Used by routes/submit.py (single complaint) and routes/dashboard.py (re-score all).
"""

import uuid
import structlog
from datetime import datetime
from typing import Dict, Any, List

from ml_pipeline.processing.gemini_processor import classify_complaint
from ml_pipeline.scoring.clustering import IssueClusterer
from ml_pipeline.scoring.priority_scorer import PriorityScorer
from ml_pipeline.utils.bigquery_client import BigQueryClient
from config.settings import USE_MOCK

log = structlog.get_logger()

_clusterer = IssueClusterer()
_scorer = PriorityScorer()
_bq_client = BigQueryClient(use_mock=USE_MOCK)


def process_submission(raw_text: str, ward: str = "Unknown",
                        input_type: str = "text",
                        citizen_id: str = None) -> Dict[str, Any]:
    """
    Runs ONE citizen complaint through classification (Layer 2)
    and stores it (Layer 3). Returns the stored record.
    Called by routes/submit.py.
    """
    submission_id = str(uuid.uuid4())
    citizen_id = citizen_id or f"cit_{uuid.uuid4().hex[:8]}"

    log.info("Processing submission", submission_id=submission_id, input_type=input_type)

    # Layer 2 — Gemini classification
    classification = classify_complaint(raw_text)

    record = {
        "submission_id": submission_id,
        "citizen_id": citizen_id,
        "input_type": input_type,
        "raw_text": raw_text,
        "category": classification["category"],
        "urgency": classification["urgency"],
        "summary": classification["summary"],
        "entities": classification["entities"],
        "ward": ward,
        "timestamp": datetime.utcnow().isoformat(),
    }

    # Layer 3 — Store
    _bq_client.store_submissions([record])

    log.info("Submission stored",
              submission_id=submission_id,
              category=record["category"],
              urgency=record["urgency"])

    return record


def recompute_priorities() -> List[Dict[str, Any]]:
    """
    Runs Layers 4 + 5 over ALL stored submissions:
    cluster by category/ward, then compute priority scores.
    Called periodically (e.g. every 6 hours) or on-demand by dashboard route.
    """
    submissions = _bq_client.get_all()

    if not submissions:
        log.warning("No submissions found to score")
        return []

    log.info("Recomputing priorities", total_submissions=len(submissions))

    clusters = _clusterer.cluster(submissions)
    scored = _scorer.score_all(clusters)
    ranked = sorted(scored, key=lambda x: x["final_score"], reverse=True)

    for i, item in enumerate(ranked, 1):
        item["rank"] = i

    log.info("Priorities recomputed", total_clusters=len(ranked))
    return ranked


def get_bq_client() -> BigQueryClient:
    """Exposes the shared BigQuery client instance to routes that need raw reads (e.g. /stats)."""
    return _bq_client


def get_cluster_detail(cluster_id: str) -> Dict[str, Any]:
    """Returns full evidence for a single cluster, used by /cluster/{id}."""
    ranked = recompute_priorities()
    match = next((c for c in ranked if c["cluster_id"] == cluster_id), None)
    return match

