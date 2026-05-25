from fastapi import FastAPI
from app.db.database import db
from app.routes.chat_routes import router
from app.routes.log_routes import router as log_router
from app.routes.conversation_routes import router as conversation_routes
import os

if not os.getenv("GEMINI_API_KEY"):
    raise RuntimeError("GEMINI_API_KEY is not set. Check your .env file.")

app = FastAPI()

app.include_router(router)
app.include_router(log_router)
app.include_router(conversation_routes)


@app.get("/")
async def root():
    return {"message": "InferFlow Backend Running"}


@app.on_event("startup")
async def startup_event():

    await db.inference_logs.create_index("conversation_id")

    await db.inference_logs.create_index("created_at")

    await db.chats.create_index("created_at")

