import os
import time
import asyncio
from groq import Groq
from dotenv import load_dotenv
from app.services.log_service import ingest_log

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

MODEL = "llama-3.3-70b-versatile"


async def send_log(log_data: dict):
    await ingest_log(log_data)


# ─── Non-streaming ────────────────────────────────────────────
async def call_groq_with_logging(
    conversation_id: str,
    messages: list
):
    start_time = time.time()

    try:
        formatted_messages = [
            {"role": msg["role"], "content": msg["content"]}
            for msg in messages
        ]

        response = await asyncio.to_thread(
            client.chat.completions.create,
            model=MODEL,
            messages=formatted_messages
        )

        latency = time.time() - start_time
        ai_response = response.choices[0].message.content
        usage = response.usage

        await send_log({
            "conversation_id": conversation_id,
            "provider": "groq",
            "model": MODEL,
            "latency": latency,
            "prompt_tokens": usage.prompt_tokens,
            "completion_tokens": usage.completion_tokens,
            "total_tokens": usage.total_tokens,
            "status": "success",
            "input_preview": messages[-1]["content"][:100],
            "output_preview": ai_response[:100]
        })

        return ai_response

    except Exception as e:
        latency = time.time() - start_time

        await send_log({
            "conversation_id": conversation_id,
            "provider": "groq",
            "model": MODEL,
            "latency": latency,
            "status": "error",
            "error_message": str(e),
            "input_preview": messages[-1]["content"][:100]
        })

        raise


# ─── Streaming ────────────────────────────────────────────────
async def stream_groq_with_logging(
    conversation_id: str,
    messages: list
):
    start_time = time.time()
    full_response = ""

    try:
        formatted_messages = [
            {"role": msg["role"], "content": msg["content"]}
            for msg in messages
        ]

        stream = await asyncio.to_thread(
            client.chat.completions.create,
            model=MODEL,
            messages=formatted_messages,
            stream=True
        )

        for chunk in stream:
            text = chunk.choices[0].delta.content or ""
            if text:
                full_response += text
                yield f"data: {text}\n\n"

        latency = time.time() - start_time

        await send_log({
            "conversation_id": conversation_id,
            "provider": "groq",
            "model": MODEL,
            "latency": latency,
            "status": "success",
            "input_preview": messages[-1]["content"][:100],
            "output_preview": full_response[:100],
            "prompt_tokens": None,
            "completion_tokens": None,
            "total_tokens": None
        })

        yield f"data: [DONE]{conversation_id}\n\n"

    except Exception as e:
        latency = time.time() - start_time

        await send_log({
            "conversation_id": conversation_id,
            "provider": "groq",
            "model": MODEL,
            "latency": latency,
            "status": "error",
            "error_message": str(e),
            "input_preview": messages[-1]["content"][:100]
        })

        yield f"data: [ERROR]{str(e)}\n\n"