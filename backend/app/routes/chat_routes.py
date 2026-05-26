from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from typing import Literal

from app.services.chat_service import handle_chat, handle_chat_stream

router = APIRouter()


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=10000)
    conversation_id: str | None = None
    provider: Literal["gemini", "groq"] = "gemini"


@router.post("/chat")
async def chat(request: ChatRequest):
    return await handle_chat(
        message=request.message,
        conversation_id=request.conversation_id,
        provider=request.provider
    )


@router.post("/chat/stream")
async def chat_stream(request: ChatRequest):
    generator = await handle_chat_stream(
        message=request.message,
        conversation_id=request.conversation_id,
        provider=request.provider
    )

    return StreamingResponse(
        generator,
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        }
    )