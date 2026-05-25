from fastapi import HTTPException
from bson import ObjectId
from bson.errors import InvalidId

from app.db.database import db


async def fetch_all_conversations():

    conversations = await db.chats.find().sort("created_at", -1).to_list(length=100)

    return [
        {
            "id": str(convo["_id"]),
            "title": convo["title"],
            "created_at": convo.get("created_at"),
            "status": convo.get("status")
        }
        for convo in conversations
    ]


async def fetch_single_conversation(conversation_id: str):

    try:
        oid = ObjectId(conversation_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid conversation ID format")

    conversation = await db.chats.find_one({"_id": oid})

    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    return {
        "id": str(conversation["_id"]),
        "title": conversation["title"],
        "messages": conversation["messages"],
        "provider": conversation.get("provider"),
        "model": conversation.get("model"),
        "status": conversation.get("status")
    }


async def delete_single_conversation(conversation_id: str):

    try:
        oid = ObjectId(conversation_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid conversation ID format")

    result = await db.chats.delete_one({"_id": oid})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Conversation not found")

    await db.inference_logs.delete_many({"conversation_id": conversation_id})

    return {"message": "Conversation deleted successfully"}


async def cancel_conversation(conversation_id: str):

    try:
        oid = ObjectId(conversation_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid conversation ID format")

    result = await db.chats.update_one(
        {"_id": oid},
        {"$set": {"status": "cancelled"}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Conversation not found")

    return {"message": "Conversation cancelled successfully"}