from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

from app.db.database import db

router = APIRouter()

class InferenceLog(BaseModel):

    conversation_id: str

    provider: str

    model: str

    latency: float

    status: str

    input_preview: str

    output_preview: Optional[str] = None

    error_message: Optional[str] = None

    prompt_tokens: Optional[int] = None

    completion_tokens: Optional[int] = None

    total_tokens: Optional[int] = None


@router.post("/logs/ingest")
async def ingest_logs(log: InferenceLog):

    log_data = log.dict()

    result = await db.inference_logs.insert_one(log_data)

    return {
        "message": "Log stored successfully",
        "log_id": str(result.inserted_id)
    }