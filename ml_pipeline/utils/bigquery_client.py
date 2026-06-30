"""
BigQuery Client - Stores and retrieves submissions
Mock mode: in-memory store. Production: google.cloud.bigquery
"""

from typing import List, Dict, Any
from datetime import datetime


class BigQueryClient:
    def __init__(self, use_mock=True):
        self.use_mock = use_mock
        self._store = []  # In-memory mock store

        if not use_mock:
            from google.cloud import bigquery
            self.client = bigquery.Client()
            self.table_id = "your_project.peoples_priority.submissions"

    def store_submissions(self, submissions: List[Dict[str, Any]]):
        if self.use_mock:
            self._store.extend(submissions)
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
            return self._store
        else:
            query = f"SELECT * FROM `{self.table_id}` ORDER BY timestamp DESC"
            return [dict(row) for row in self.client.query(query).result()]


# ─── BigQuery Schema (run once to create table) ────────────────────────────────
BQ_SCHEMA_SQL = """
CREATE TABLE IF NOT EXISTS `your_project.peoples_priority.submissions` (
  submission_id   STRING NOT NULL,
  citizen_id      STRING,
  input_type      STRING,        -- voice | text | photo | whatsapp | sms
  raw_text        STRING,
  translated_text STRING,
  category        STRING,        -- Road | Water | School | Health | Agriculture | ...
  urgency_level   STRING,        -- life_threatening | health_risk | daily_hardship | ...
  urgency_score   FLOAT64,       -- 0-100
  sentiment_score FLOAT64,       -- 0-10
  ward            STRING,
  lat             FLOAT64,
  lng             FLOAT64,
  timestamp       TIMESTAMP,
  one_line_summary STRING,
  gemini_reasoning STRING
)
PARTITION BY DATE(timestamp)
CLUSTER BY category, ward;

-- Aggregation query used by scoring engine
CREATE OR REPLACE VIEW `your_project.peoples_priority.cluster_stats` AS
SELECT
  category,
  ward,
  COUNT(*)                    AS submission_count,
  AVG(urgency_score)          AS avg_urgency,
  AVG(sentiment_score)        AS avg_sentiment,
  COUNT(DISTINCT input_type)  AS channel_diversity,
  COUNT(DISTINCT citizen_id)  AS unique_citizens,
  ARRAY_AGG(translated_text LIMIT 3) AS sample_quotes
FROM `your_project.peoples_priority.submissions`
WHERE timestamp >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 DAY)
GROUP BY category, ward;
"""

