from fastapi import HTTPException
from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime, timezone
from typing import AsyncGenerator

from app.db.database import db
from app.services.gemini_service import call_llm_with_logging, stream_llm_with_logging
from app.services.groq_service import call_groq_with_logging, stream_groq_with_logging
from app.utils.pii_redactor import redact_pii

SUPPORTED_PROVIDERS = ["gemini", "groq"]


async def _get_or_create_conversation(
    message: str,
    conversation_id: str | None,
    provider: str
) -> tuple[str, list]:

    user_message = {
        "role": "user",
        "content": redact_pii(message)
    }

    if conversation_id:
        try:
            oid = ObjectId(conversation_id)
        except InvalidId:
            raise HTTPException(status_code=400, detail="Invalid conversation ID format")

        conversation = await db.chats.find_one({"_id": oid})

        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")

        messages = conversation["messages"]
        messages.append(user_message)

        await db.chats.update_one(
            {"_id": oid},
            {"$push": {"messages": user_message}}
        )

    else:
        new_chat = {
            "title": message[:30],
            "messages": [user_message],
            "provider": provider,
            "model": "gemini-2.5-flash" if provider == "gemini" else "llama-3.3-70b-versatile",
            "status": "active",
            "created_at": datetime.now(timezone.utc)
        }

        result = await db.chats.insert_one(new_chat)
        conversation_id = str(result.inserted_id)
        messages = [user_message]

    return conversation_id, messages


# ─── Non-streaming ────────────────────────────────────────────
async def handle_chat(
    message: str,
    conversation_id: str | None,
    provider: str = "gemini"
):
    if provider not in SUPPORTED_PROVIDERS:
        raise HTTPException(status_code=400, detail=f"Unsupported provider: {provider}")

    conversation_id, messages = await _get_or_create_conversation(
        message, conversation_id, provider
    )

    if provider == "groq":
        ai_response = await call_groq_with_logging(
            conversation_id=conversation_id,
            messages=messages
        )
    else:
        ai_response = await call_llm_with_logging(
            conversation_id=conversation_id,
            messages=messages
        )

    await db.chats.update_one(
        {"_id": ObjectId(conversation_id)},
        {"$push": {"messages": {"role": "assistant", "content": ai_response}}}
    )

    return {
        "conversation_id": conversation_id,
        "response": ai_response
    }


# ─── Streaming ────────────────────────────────────────────────
async def handle_chat_stream(
    message: str,
    conversation_id: str | None,
    provider: str = "gemini"
) -> AsyncGenerator[str, None]:

    if provider not in SUPPORTED_PROVIDERS:
        raise HTTPException(status_code=400, detail=f"Unsupported provider: {provider}")

    conversation_id, messages = await _get_or_create_conversation(
        message, conversation_id, provider
    )

    full_response = ""

    async def generator():
        nonlocal full_response

        yield f"data: [ID]{conversation_id}\n\n"

        stream_fn = (
            stream_groq_with_logging
            if provider == "groq"
            else stream_llm_with_logging
        )

        async for chunk in stream_fn(
            conversation_id=conversation_id,
            messages=messages
        ):
            if chunk.startswith("data: ") and not chunk.startswith("data: ["):
                full_response += chunk.replace("data: ", "").replace("\n\n", "")
            yield chunk

        if full_response:
            await db.chats.update_one(
                {"_id": ObjectId(conversation_id)},
                {"$push": {"messages": {"role": "assistant", "content": full_response}}}
            )

    return generator()