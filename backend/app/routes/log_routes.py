from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional

from app.services.log_service import ingest_log, fetch_logs

router = APIRouter()


class InferenceLog(BaseModel):
    conversation_id: str
    provider: str
    model: str
    latency: float
    status: str
    input_preview: str = Field(..., max_length=200)
    output_preview: Optional[str] = Field(None, max_length=200)
    error_message: Optional[str] = None
    prompt_tokens: Optional[int] = None
    completion_tokens: Optional[int] = None
    total_tokens: Optional[int] = None


@router.post("/logs/ingest")
async def ingest_logs(log: InferenceLog):
    log_data = log.model_dump()
    return await ingest_log(log_data)


@router.get("/logs")
async def get_logs():
    return await fetch_logs()