"""
Layer 5: Priority Scoring Engine
Formula: Final Score = Demand(35%) + Need(35%) + Urgency(20%) + Feasibility(10%)
Adapted to consume ComplaintResponse schema from ml_pipeline/processing/response_validator.py
(category: Category enum, urgency: Urgency enum, summary, entities)
"""

from typing import List, Dict, Any

from ml_pipeline.config.settings import WEIGHT_DEMAND, WEIGHT_NEED, WEIGHT_URGENCY, WEIGHT_FEASIBILITY


# ─── Urgency enum → numeric score ───────────────────────────────────────────
URGENCY_SCORE_MAP = {
    "Critical": 100,
    "High": 75,
    "Medium": 50,
    "Low": 25,
}

# ─── Public Dataset Mock (data.gov.in / Census / NFHS) ──────────────────────
# Keys match teammate's Category enum values exactly: Road, Water, Healthcare,
# Education, Electricity, Agriculture, Sanitation, Housing, Transport, Other
PUBLIC_DATA = {
    "Road": {
        "Ward 1":  {"connectivity_index": 0.3, "accident_reports": 5, "population": 8000},
        "Ward 2":  {"connectivity_index": 0.7, "accident_reports": 1, "population": 5000},
        "Ward 3":  {"connectivity_index": 0.2, "accident_reports": 8, "population": 12000},
        "default": {"connectivity_index": 0.5, "accident_reports": 2, "population": 7000},
    },
    "Water": {
        "Ward 1":  {"water_coverage": 0.4, "nfhs_water_scarcity": 0.7, "population": 8000},
        "Ward 2":  {"water_coverage": 0.8, "nfhs_water_scarcity": 0.2, "population": 5000},
        "default": {"water_coverage": 0.6, "nfhs_water_scarcity": 0.4, "population": 7000},
    },
    "Education": {
        "Ward 1":  {"enrollment_rate": 0.6, "nearest_school_km": 3.5, "population": 8000},
        "default": {"enrollment_rate": 0.75, "nearest_school_km": 2.0, "population": 7000},
    },
    "Healthcare": {
        "Ward 1":  {"hospital_distance_km": 8.0, "infant_mortality": 45, "population": 8000},
        "default": {"hospital_distance_km": 5.0, "infant_mortality": 35, "population": 7000},
    },
    "Agriculture": {
        "default": {"irrigation_coverage": 0.4, "crop_loss_reports": 3, "population": 6000},
    },
    "Electricity": {
        "default": {"electrification_rate": 0.6, "outage_hours_per_day": 4, "population": 7000},
    },
    "Sanitation": {
        "default": {"open_defecation_rate": 0.3, "waste_collection_freq": 2, "population": 7000},
    },
    "Housing": {
        "default": {"housing_deficit_index": 0.4, "population": 6000},
    },
    "Transport": {
        "default": {"public_transport_coverage": 0.5, "population": 6000},
    },
    "Other": {
        "default": {"general_need_index": 0.5, "population": 6000},
    },
}

# Development plan (uploaded by MP office in production)
EXISTING_DEV_PLAN = {
    "Road": True,
    "Water": True,
    "Education": False,
    "Healthcare": False,
    "Agriculture": True,
    "Electricity": False,
    "Sanitation": False,
    "Housing": False,
    "Transport": False,
}

MAX_EXPECTED_REQUESTS = 200  # Normalization constant


class PriorityScorer:
    """
    Computes a 0-100 priority score for each issue cluster.
    Expects clusters built from ComplaintResponse-shaped submissions:
    {category, urgency, summary, entities, ward, count, wards, channel_diversity, ...}
    """

    def score_all(self, clusters: Dict[str, Dict]) -> List[Dict]:
        scored = []
        for cluster_id, cluster in clusters.items():
            score_breakdown = self._score_cluster(cluster)
            scored.append({**cluster, "cluster_id": cluster_id, **score_breakdown})
        return scored

    def _score_cluster(self, cluster: Dict) -> Dict:
        category = self._category_value(cluster.get("category", "Other"))
        wards = cluster.get("wards", [])
        primary_ward = wards[0] if wards else "default"

        demand_score = self._compute_demand(cluster)
        need_score, need_evidence = self._compute_need(category, primary_ward)
        urgency_score = self._compute_urgency(cluster)
        feasibility_score = self._compute_feasibility(category)

        raw_score = (
            demand_score    * WEIGHT_DEMAND
            + need_score    * WEIGHT_NEED
            + urgency_score * WEIGHT_URGENCY
            + feasibility_score * WEIGHT_FEASIBILITY
        )

        adjusted_score, reasoning = self._adjust(raw_score, cluster, need_evidence, urgency_score)

        return {
            "demand_score": round(demand_score, 1),
            "need_score": round(need_score, 1),
            "urgency_score": round(urgency_score, 1),
            "feasibility_score": round(feasibility_score, 1),
            "raw_score": round(raw_score, 1),
            "final_score": round(adjusted_score, 1),
            "need_evidence": need_evidence,
            "reasoning": reasoning,
        }

    def _category_value(self, category) -> str:
        """Handles both Category enum instances and plain strings."""
        return category.value if hasattr(category, "value") else str(category)

    def _compute_demand(self, cluster: Dict) -> float:
        count = cluster.get("count", 1)
        ward_count = len(set(cluster.get("wards", [])))
        channel_diversity = cluster.get("channel_diversity", 1)

        volume_pts   = min(50, (count / MAX_EXPECTED_REQUESTS) * 50)
        spread_pts   = min(30, (ward_count / 10) * 30)
        channel_pts  = min(20, (channel_diversity / 3) * 20)

        return volume_pts + spread_pts + channel_pts

    def _compute_need(self, category: str, ward: str) -> tuple:
        data = PUBLIC_DATA.get(category, PUBLIC_DATA["Other"])
        ward_data = data.get(ward, data.get("default", {}))

        score = 50
        evidence = []

        if category == "Road":
            conn_idx = ward_data.get("connectivity_index", 0.5)
            accidents = ward_data.get("accident_reports", 0)
            score += (1 - conn_idx) * 30
            score += min(20, accidents * 4)
            evidence.append(f"Connectivity index: {conn_idx} (lower = worse)")
            evidence.append(f"Accident reports: {accidents} last month")

        elif category == "Water":
            scarcity = ward_data.get("nfhs_water_scarcity", 0.5)
            coverage = ward_data.get("water_coverage", 0.6)
            score += scarcity * 30
            score += (1 - coverage) * 20
            evidence.append(f"NFHS water scarcity score: {scarcity}")
            evidence.append(f"Current water coverage: {coverage*100:.0f}%")

        elif category == "Education":
            enrollment = ward_data.get("enrollment_rate", 0.75)
            distance = ward_data.get("nearest_school_km", 2.0)
            score += (1 - enrollment) * 25
            score += min(25, distance * 5)
            evidence.append(f"Enrollment rate: {enrollment*100:.0f}%")
            evidence.append(f"Nearest school: {distance} km away")

        elif category == "Healthcare":
            distance = ward_data.get("hospital_distance_km", 5.0)
            mortality = ward_data.get("infant_mortality", 35)
            score += min(25, distance * 2)
            score += min(25, mortality * 0.4)
            evidence.append(f"Nearest hospital: {distance} km")
            evidence.append(f"Infant mortality rate: {mortality}/1000")

        else:
            evidence.append("General need assessment applied")

        return min(100, max(0, score)), evidence

    def _compute_urgency(self, cluster: Dict) -> float:
        """
        Maps teammate's Urgency enum (Critical/High/Medium/Low) to 0-100.
        Cluster stores avg_urgency_score, pre-computed during clustering
        by averaging URGENCY_SCORE_MAP values across submissions.
        """
        return min(100, cluster.get("avg_urgency_score", 50))

    def _compute_feasibility(self, category: str) -> float:
        in_plan = EXISTING_DEV_PLAN.get(category, False)
        budget_ok = category in ["Road", "Water", "Education", "Sanitation"]

        score = 0
        if in_plan:
            score += 60
        if budget_ok:
            score += 40
        return score

    def _adjust(self, raw_score: float, cluster: Dict, evidence: List[str], urgency_score: float) -> tuple:
        count = cluster.get("count", 1)
        adjustment = 0
        reasoning_parts = []

        if urgency_score >= 85:
            adjustment += 3
            reasoning_parts.append("Critical urgency detected (+3)")

        if len(set(cluster.get("wards", []))) >= 3:
            adjustment += 2
            reasoning_parts.append(f"Widespread demand across {len(set(cluster['wards']))} wards (+2)")

        if count < 5:
            adjustment -= 3
            reasoning_parts.append("Limited citizen reports, low confidence (-3)")

        if evidence and len(evidence) >= 2:
            adjustment += 1
            reasoning_parts.append("Public data strongly validates this need (+1)")

        adjustment = max(-5, min(5, adjustment))
        adjusted_score = min(100, max(0, raw_score + adjustment))

        reasoning = "; ".join(reasoning_parts) if reasoning_parts else "Score confirmed by rule-based analysis."
        return adjusted_score, reasoning


def urgency_to_score(urgency) -> int:
    """Helper used by clustering.py to convert Urgency enum/string to numeric score."""
    value = urgency.value if hasattr(urgency, "value") else str(urgency)
    return URGENCY_SCORE_MAP.get(value, 50)
