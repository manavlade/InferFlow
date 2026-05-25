from fastapi import HTTPException
from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime, timezone

from app.db.database import db
from app.services.gemini_service import call_llm_with_logging


async def handle_chat(message: str, conversation_id: str | None):

    user_message = {
        "role": "user",
        "content": message
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
            "provider": "gemini",
            "model": "gemini-2.5-flash",
            "status": "active",
            "created_at": datetime.now(timezone.utc)
        }

        result = await db.chats.insert_one(new_chat)
        conversation_id = str(result.inserted_id)
        messages = [user_message]

    ai_response = await call_llm_with_logging(
        conversation_id=conversation_id,
        messages=messages
    )

    assistant_message = {
        "role": "assistant",
        "content": ai_response
    }

    await db.chats.update_one(
        {"_id": ObjectId(conversation_id)},
        {"$push": {"messages": assistant_message}}
    )

    return {
        "conversation_id": conversation_id,
        "response": ai_response
    }