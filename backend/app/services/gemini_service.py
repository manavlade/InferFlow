import os
import time

from google import genai
from dotenv import load_dotenv
import asyncio

import httpx

from app.services.log_service import ingest_log

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


async def send_log_to_ingestion(log_data: dict):
    await ingest_log(log_data)


async def call_llm_with_logging(
    conversation_id: str,
    messages: list
):

    start_time = time.time()

    try:

        formatted_prompt = ""

        for msg in messages:
            formatted_prompt += f"{msg['role']}: {msg['content']}\n"

        input_token_info = await asyncio.to_thread(
            client.models.count_tokens,
            model="gemini-2.5-flash",
            contents=formatted_prompt
        )

        response = await asyncio.to_thread(
            client.models.generate_content,
            model="gemini-2.5-flash",
            contents=formatted_prompt
        )

        latency = time.time() - start_time

        ai_response = response.text

        usage = response.usage_metadata

        prompt_tokens = getattr(
            usage,
            "prompt_token_count",
            None
        )

        completion_tokens = getattr(
            usage,
            "candidates_token_count",
            None
        )

        total_tokens = getattr(
            usage,
            "total_token_count",
            None
        )

        log_data = {

            "conversation_id": conversation_id,

            "provider": "gemini",

            "model": "gemini-2.5-flash",

            "latency": latency,

            "prompt_tokens": prompt_tokens,

            "completion_tokens": completion_tokens,

            "total_tokens": total_tokens,

            "status": "success",

            "input_preview": messages[-1]["content"][:100],

            "output_preview": ai_response[:100]
        }

        # Send to ingestion API
        await send_log_to_ingestion(log_data)

        return ai_response

    except Exception as e:

        latency = time.time() - start_time

        log_data = {
            "conversation_id": conversation_id,
            "provider": "gemini",
            "model": "gemini-2.5-flash",
            "latency": latency,
            "status": "error",
            "error_message": str(e),
            "input_preview": messages[-1]["content"][:100]
        }

        await send_log_to_ingestion(log_data)

        raise  # ✅ bare raise, preserves traceback