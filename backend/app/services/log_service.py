from datetime import datetime, timezone
from app.db.database import db
from app.utils.pii_redactor import redact_pii


async def ingest_log(log_data: dict):

    log_data["created_at"] = datetime.now(timezone.utc)

    # Redact PII from previews before storing
    if log_data.get("input_preview"):
        log_data["input_preview"] = redact_pii(log_data["input_preview"])

    if log_data.get("output_preview"):
        log_data["output_preview"] = redact_pii(log_data["output_preview"])

    if log_data.get("error_message"):
        log_data["error_message"] = redact_pii(log_data["error_message"])

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