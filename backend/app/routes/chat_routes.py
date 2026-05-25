from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.services.chat_service import handle_chat

router = APIRouter()


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=10000)
    conversation_id: str | None = None


@router.post("/chat")
async def chat(request: ChatRequest):
    return await handle_chat(
        message=request.message,
        conversation_id=request.conversation_id
    )