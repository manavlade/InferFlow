from fastapi import APIRouter
from pydantic import BaseModel
from bson import ObjectId

from app.db.database import db
from app.services.gemini_service import call_llm_with_logging

router = APIRouter()


class ChatRequest(BaseModel):
    message: str
    conversation_id: str | None = None


@router.post("/chat")
async def chat(request: ChatRequest):

    user_message = {
        "role": "user",
        "content": request.message
    }

    # Existing conversation
    if request.conversation_id:

        conversation = await db.chats.find_one({
            "_id": ObjectId(request.conversation_id)
        })

        messages = conversation["messages"]

        messages.append(user_message)

        conversation_id = request.conversation_id

    # New conversation
    else:

        new_chat = {

            "title": request.message[:30],

            "messages": [user_message],

            "provider": "gemini",

            "model": "gemini-2.5-flash",

            "status": "active"
        }

        result = await db.chats.insert_one(new_chat)

        conversation_id = str(result.inserted_id)

        messages = [user_message]

    # Call Gemini wrapper
    ai_response = await call_llm_with_logging(
        conversation_id=conversation_id,
        messages=messages
    )

    assistant_message = {
        "role": "assistant",
        "content": ai_response
    }

    # Save assistant response
    await db.chats.update_one(
        {
            "_id": ObjectId(conversation_id)
        },
        {
            "$push": {
                "messages": assistant_message
            }
        }
    )

    return {
        "conversation_id": conversation_id,
        "response": ai_response
    }