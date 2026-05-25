from datetime import datetime, timezone
from fastapi import HTTPException

from app.db.database import db


async def ingest_log(log_data: dict):

    log_data["created_at"] = datetime.now(timezone.utc)

    await db.inference_logs.insert_one(log_data)

    return {"message": "Log stored successfully"}


async def fetch_logs():

    logs = await db.inference_logs.find().sort("created_at", -1).to_list(length=100)

    return [
        {
            "id": str(log["_id"]),
            "conversation_id": log.get("conversation_id"),
            "provider": log.get("provider"),
            "model": log.get("model"),
            "latency": log.get("latency"),
            "prompt_tokens": log.get("prompt_tokens"),
            "completion_tokens": log.get("completion_tokens"),
            "total_tokens": log.get("total_tokens"),
            "status": log.get("status"),
            "created_at": log.get("created_at"),
            "input_preview": log.get("input_preview"),
            "output_preview": log.get("output_preview"),
            "error_message": log.get("error_message")
        }
        for log in logs
    ]