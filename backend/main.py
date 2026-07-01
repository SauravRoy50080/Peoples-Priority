"""
backend/main.py
FastAPI application entry point.
Run: uvicorn backend.main:app --reload --port 8000
"""

import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import structlog

from config.settings import APP_ENV, APP_PORT, IS_PRODUCTION

log = structlog.get_logger()


@asynccontextmanager
async def lifespan(app: FastAPI):
    log.info("Starting Peoples Priority API", env=APP_ENV)
    yield
    log.info("Shutting down")


app = FastAPI(
    title="People's Priority API",
    description="Citizen-to-MP priority pipeline backend",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routes ───────────────────────────────────────────────────
from backend.routes import submit, dashboard, webhook
app.include_router(submit.router,    prefix="/api/v1", tags=["Submit"])
app.include_router(dashboard.router, prefix="/api/v1", tags=["Dashboard"])
app.include_router(webhook.router,   prefix="/webhook", tags=["Webhooks"])


@app.get("/")
async def root():
    return {
        "service": "People's Priority API",
        "version": "1.0.0",
        "status": "running",
        "env": APP_ENV,
    }

@app.get("/health")
async def health():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0",
                port=APP_PORT, reload=not IS_PRODUCTION)


