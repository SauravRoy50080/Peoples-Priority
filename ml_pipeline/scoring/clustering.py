"""
Layer 4: Issue Clustering
Groups submissions by category (from ComplaintResponse) + ward into clusters
ready for priority_scorer.py.
"""

from collections import defaultdict
from typing import List, Dict, Any
from ml_pipeline.scoring.priority_scorer import urgency_to_score


class IssueClusterer:
    """
    Clusters submissions by category, aggregating ward spread, urgency,
    channel diversity, and sample text — the shape priority_scorer.py expects.

    Each submission is expected to look like:
    {
        "submission_id": str,
        "category": Category enum or str,
        "urgency": Urgency enum or str,
        "summary": str,
        "entities": {...},
        "ward": str,
        "input_type": str,   # voice | text | photo | whatsapp | sms
    }
    """

    def cluster(self, submissions: List[Dict[str, Any]]) -> Dict[str, Dict]:
        by_category = defaultdict(list)
        for sub in submissions:
            cat = self._category_value(sub.get("category", "Other"))
            by_category[cat].append(sub)

        clusters = {}
        for category, subs in by_category.items():
            ward_counts = defaultdict(int)
            for sub in subs:
                ward = sub.get("ward", "Unknown")
                ward_counts[ward] += 1
            top_wards = sorted(ward_counts.items(), key=lambda x: x[1], reverse=True)

            urgency_scores = [urgency_to_score(s.get("urgency", "Medium")) for s in subs]
            avg_urgency = sum(urgency_scores) / len(urgency_scores) if urgency_scores else 50

            channels = set(sub.get("input_type", "text") for sub in subs)

            sorted_subs = sorted(
                subs,
                key=lambda x: urgency_to_score(x.get("urgency", "Medium")),
                reverse=True,
            )
            sample_quotes = [s.get("summary", "")[:120] for s in sorted_subs[:3]]

            clusters[category] = {
                "label": f"{category} Issues",
                "category": category,
                "count": len(subs),
                "wards": [w for w, _ in top_wards],
                "ward_distribution": dict(top_wards),
                "avg_urgency_score": round(avg_urgency, 1),
                "channels_used": list(channels),
                "channel_diversity": len(channels),
                "sample_quotes": sample_quotes,
                "submissions": subs,
            }

        return clusters

    def _category_value(self, category) -> str:
        return category.value if hasattr(category, "value") else str(category)
