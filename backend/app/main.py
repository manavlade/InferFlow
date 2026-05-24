from fastapi import FastAPI
from app.db.database import db
from app.routes.chat_routes import router
from app.routes.log_routes import router as log_router

app = FastAPI()

app.include_router(router)
app.include_router(log_router)


@app.get("/")
async def root():
    return {"message": "InferFlow Backend Running"}


@app.get("/test-db")
async def test_db():
    collections = await db.list_collection_names()

    return {
        "collections": collections
    }