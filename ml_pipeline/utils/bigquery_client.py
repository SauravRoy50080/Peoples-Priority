"""
BigQuery Client - Stores and retrieves submissions
Mock mode: JSON-file-backed store (survives server restarts).
Production: google.cloud.bigquery
"""

import json
import os
from typing import List, Dict, Any
from datetime import datetime

MOCK_STORE_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".mock_store.json")


def _load_store():
    if os.path.exists(MOCK_STORE_PATH):
        try:
            with open(MOCK_STORE_PATH, "r") as f:
                return json.load(f)
        except Exception:
            pass
    return []


def _save_store(store):
    with open(MOCK_STORE_PATH, "w") as f:
        json.dump(store, f, default=str)


class BigQueryClient:
    _store = _load_store()  # Class-level, loaded once from disk, persists across restarts

    def __init__(self, use_mock=True):
        self.use_mock = use_mock

        if not use_mock:
            from google.cloud import bigquery
            self.client = bigquery.Client()
            self.table_id = "your_project.peoples_priority.submissions"

    def store_submissions(self, submissions: List[Dict[str, Any]]):
        if self.use_mock:
            BigQueryClient._store.extend(submissions)
            _save_store(BigQueryClient._store)
        else:
            rows = [self._to_bq_row(s) for s in submissions]
            errors = self.client.insert_rows_json(self.table_id, rows)
            if errors:
                raise RuntimeError(f"BigQuery insert errors: {errors}")

    def _to_bq_row(self, sub: Dict) -> Dict:
        return {
            "submission_id": sub["submission_id"],
            "citizen_id": sub["citizen_id"],
            "input_type": sub["input_type"],
            "raw_text": sub.get("raw_text"),
            "category": sub.get("category"),
            "urgency": sub.get("urgency"),
            "summary": sub.get("summary"),
            "entities": sub.get("entities"),
            "ward": sub.get("ward"),
            "timestamp": sub.get("timestamp"),
        }

    def get_all(self) -> List[Dict]:
        if self.use_mock:
            return list(BigQueryClient._store)
        else:
            query = f"SELECT * FROM `{self.table_id}` ORDER BY timestamp DESC"
            return [dict(row) for row in self.client.query(query).result()]
