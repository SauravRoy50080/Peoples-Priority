"""
backend/routes/dashboard.py
GET /priorities, GET /cluster/{id}, GET /stats
(Heatmap omitted — needs lat/lng which the current Layer 2 schema doesn't capture.)
"""

from fastapi import APIRouter, HTTPException
from datetime import datetime
import structlog

from backend.services.pipeline_trigger import recompute_priorities, get_cluster_detail, get_bq_client

log = structlog.get_logger()
router = APIRouter()


@router.get("/priorities")
async def get_priorities():
    """
    Returns the ranked list of issue clusters for the MP dashboard.
    Re-clusters and re-scores all stored submissions on each call (mock mode).
    In production, swap this to read from a pre-computed BigQuery table
    refreshed by a scheduled job, rather than recomputing per request.
    """
    ranked = recompute_priorities()

    return {
        "priorities": [
            {
                "cluster_id": r["cluster_id"],
                "rank": r["rank"],
                "label": r["label"],
                "category": r["category"],
                "final_score": r["final_score"],
                "demand_score": r["demand_score"],
                "need_score": r["need_score"],
                "urgency_score": r["urgency_score"],
                "feasibility_score": r["feasibility_score"],
                "count": r["count"],
                "wards": r["wards"],
                "reasoning": r["reasoning"],
                "sample_quotes": r["sample_quotes"],
            }
            for r in ranked
        ],
        "last_updated": datetime.utcnow().isoformat(),
    }


@router.get("/cluster/{cluster_id}")
async def get_cluster(cluster_id: str):
    """Returns full evidence for one issue cluster."""
    cluster = get_cluster_detail(cluster_id)
    if not cluster:
        raise HTTPException(status_code=404, detail="Cluster not found")

    return {
        "cluster_id": cluster["cluster_id"],
        "label": cluster["label"],
        "category": cluster["category"],
        "final_score": cluster["final_score"],
        "need_evidence": cluster["need_evidence"],
        "sample_quotes": cluster["sample_quotes"],
        "channels_used": cluster["channels_used"],
        "wards": cluster["wards"],
        "reasoning": cluster["reasoning"],
    }


@router.get("/stats")
async def get_stats():
    """Summary stats for the dashboard header."""
    submissions = get_bq_client().get_all()

    if not submissions:
        return {
            "total_submissions": 0,
            "total_clusters": 0,
            "top_category": None,
            "channels_breakdown": {},
        }

    category_counts = {}
    channel_counts = {}
    for s in submissions:
        cat = s.get("category")
        cat = cat.value if hasattr(cat, "value") else cat
        category_counts[cat] = category_counts.get(cat, 0) + 1

        ch = s.get("input_type", "text")
        channel_counts[ch] = channel_counts.get(ch, 0) + 1

    top_category = max(category_counts, key=category_counts.get) if category_counts else None

    return {
        "total_submissions": len(submissions),
        "total_clusters": len(category_counts),
        "top_category": top_category,
        "channels_breakdown": channel_counts,
    }

