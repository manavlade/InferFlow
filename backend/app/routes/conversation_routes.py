from fastapi import APIRouter

from app.services.conversation_service import (
    fetch_all_conversations,
    fetch_single_conversation,
    delete_single_conversation,
    cancel_conversation
)

router = APIRouter()


@router.get("/conversations")
async def get_conversations():

    return await fetch_all_conversations()


@router.get("/conversation/{conversation_id}")
async def get_single_conversation(conversation_id: str):

    return await fetch_single_conversation(conversation_id)

@router.delete("/conversation/{conversation_id}")
async def delete_conversation(conversation_id: str):

    return await delete_single_conversation(conversation_id)

@router.patch("/conversation/{conversation_id}/cancel")
async def cancel_conversation_route(conversation_id: str):
    return await cancel_conversation(conversation_id)
