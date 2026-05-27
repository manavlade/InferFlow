import os
import time
import asyncio

from google import genai
from dotenv import load_dotenv
from app.services.log_service import ingest_log

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


async def send_log_to_ingestion(log_data: dict):
    await ingest_log(log_data)


def _format_prompt(messages: list) -> str:
    return "".join(
        f"{msg['role']}: {msg['content']}\n"
        for msg in messages
    )


# ─── Non-streaming ────────────────────────────────────────────
async def call_llm_with_logging(
    conversation_id: str,
    messages: list
):
    start_time = time.time()

    try:
        formatted_prompt = _format_prompt(messages)

        response = await asyncio.to_thread(
            client.models.generate_content,
            model="gemini-2.5-flash",
            contents=formatted_prompt
        )

        latency = time.time() - start_time
        ai_response = response.text
        usage = response.usage_metadata

        await send_log_to_ingestion({
            "conversation_id": conversation_id,
            "provider": "gemini",
            "model": "gemini-2.5-flash",
            "latency": latency,
            "prompt_tokens": getattr(usage, "prompt_token_count", None),
            "completion_tokens": getattr(usage, "candidates_token_count", None),
            "total_tokens": getattr(usage, "total_token_count", None),
            "status": "success",
            "input_preview": messages[-1]["content"][:100],
            "output_preview": ai_response[:100]
        })

        return ai_response

    except Exception as e:
        latency = time.time() - start_time

        await send_log_to_ingestion({
            "conversation_id": conversation_id,
            "provider": "gemini",
            "model": "gemini-2.5-flash",
            "latency": latency,
            "status": "error",
            "error_message": str(e),
            "input_preview": messages[-1]["content"][:100]
        })

        raise

# ─── Streaming ────────────────────────────────────────────────
async def stream_llm_with_logging(
    conversation_id: str,
    messages: list
):
    start_time = time.time()
    full_response = ""

    prompt_tokens = None
    completion_tokens = None
    total_tokens = None

    try:
        formatted_prompt = _format_prompt(messages)

        stream = await asyncio.to_thread(
            client.models.generate_content_stream,
            model="gemini-2.5-flash",
            contents=formatted_prompt
        )

        for chunk in stream:
            text = getattr(chunk, "text", "") or ""
            if text:
                full_response += text
                yield f"data: {text}\n\n"

            usage = getattr(chunk, "usage_metadata", None)
            if usage:
                prompt_tokens = getattr(usage, "prompt_token_count", None)
                completion_tokens = getattr(usage, "candidates_token_count", None)
                total_tokens = getattr(usage, "total_token_count", None)

        # ✅ Fallback — if still None, count tokens manually after stream
        if total_tokens is None:
            try:
                full_prompt_and_response = formatted_prompt + full_response

                token_info = await asyncio.to_thread(
                    client.models.count_tokens,
                    model="gemini-2.5-flash",
                    contents=full_prompt_and_response
                )

                total_tokens = getattr(token_info, "total_tokens", None)

                # estimate split — prompt is roughly formatted_prompt portion
                prompt_token_info = await asyncio.to_thread(
                    client.models.count_tokens,
                    model="gemini-2.5-flash",
                    contents=formatted_prompt
                )

                prompt_tokens = getattr(prompt_token_info, "total_tokens", None)

                if total_tokens and prompt_tokens:
                    completion_tokens = total_tokens - prompt_tokens

            except Exception:
                pass  # token counting failed, log as None — not critical

        latency = time.time() - start_time

        await send_log_to_ingestion({
            "conversation_id": conversation_id,
            "provider": "gemini",
            "model": "gemini-2.5-flash",
            "latency": latency,
            "status": "success",
            "input_preview": messages[-1]["content"][:100],
            "output_preview": full_response[:100],
            "prompt_tokens": prompt_tokens,
            "completion_tokens": completion_tokens,
            "total_tokens": total_tokens
        })

        yield f"data: [DONE]{conversation_id}\n\n"

    except Exception as e:
        latency = time.time() - start_time

        await send_log_to_ingestion({
            "conversation_id": conversation_id,
            "provider": "gemini",
            "model": "gemini-2.5-flash",
            "latency": latency,
            "status": "error",
            "error_message": str(e),
            "input_preview": messages[-1]["content"][:100]
        })

        yield f"data: [ERROR]{str(e)}\n\n"