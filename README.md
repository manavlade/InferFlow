---

## Logging Strategy

- **Non-blocking** — logs are fired after stream completion, never blocking the response
- **Error logs captured** — failures are logged with `status: error` and `error_message`
- **PII redacted before storage** — emails, phone numbers, Aadhaar, PAN, SSN, card numbers, API keys replaced with labeled placeholders
- **Both streaming and non-streaming** paths log metadata
- **Input/output previews** capped at 100 characters to avoid large documents
- **Direct service call** — logging calls `ingest_log()` directly, no self-HTTP overhead

---

## Scaling Considerations

- **Stateless backend** — FastAPI has no in-memory state, can run multiple replicas behind a load balancer
- **MongoDB Atlas** — managed, auto-scales, built-in replication and sharding
- **Async throughout** — all DB calls use Motor (async MongoDB driver), blocking LLM calls wrapped in `asyncio.to_thread`
- **Streaming** — SSE streaming reduces perceived latency and memory pressure vs buffering full responses
- **Indexes** — `created_at` and `conversation_id` indexed for fast dashboard and log queries
- **Multi-provider** — provider-agnostic architecture, adding a new LLM is a new service file + route update

---

## Failure Handling

| Scenario | Behavior |
|---|---|
| LLM API call fails | Error caught, logged with `status: error`, exception re-raised to client |
| MongoDB insert fails | Exception propagates, 500 returned to client |
| Log ingestion fails | Currently silent — response already sent to user |
| Invalid conversation ID | 400 Bad Request with clear message |
| Conversation not found | 404 Not Found |
| Missing env variables | Server fails fast at startup with `RuntimeError` |
| User cancels stream | `AbortController` cancels fetch, partial response discarded |

---

## Tradeoffs Made

**1. PII redacted before DB storage, not before LLM call**
The LLM receives the original message for better response quality. Only storage is redacted. Full compliance would require pre-LLM redaction but risks degrading conversational quality.

**2. Direct service call for logging instead of event queue**
Simpler architecture, no Redis dependency. Tradeoff is that if the app scales to high throughput, a queue (Redis Streams, Kafka) would decouple logging from the request path and improve reliability.

**3. Messages embedded in conversation document**
Fast reads for chat history but document size grows with conversation length. For very long conversations, a separate messages collection with references would be more appropriate.

**4. Token counts unavailable during streaming**
Gemini and Groq don't return token counts mid-stream. Logged as `null` for streaming requests. Non-streaming path captures full token metadata.

**5. MongoDB over PostgreSQL**
Chosen for flexible message schema and fast prototyping. A relational DB would offer stronger consistency guarantees and better analytics queries at scale.

---

## What I Would Improve

- **Event-based architecture** — introduce Redis Streams or Kafka to decouple log ingestion from the request path, improving reliability at scale
- **Token counts for streaming** — use a tokenizer library (tiktoken) to estimate tokens client-side during streaming
- **Full PII redaction pipeline** — redact before LLM call using a dedicated PII detection service (e.g. Microsoft Presidio)
- **Rate limiting** — add per-user or per-IP rate limiting on chat endpoints
- **Authentication** — add JWT-based auth so conversations are user-scoped
- **Pagination** — replace hardcoded `length=100` with cursor-based pagination
- **Retry logic** — exponential backoff on LLM API failures
- **Self-hosted k8s deployment** — Kubernetes manifests for production-grade orchestration
- **More providers** — OpenAI, Anthropic, Cohere as additional provider options
- **Automated tests** — unit tests for PII redactor, integration tests for ingestion pipeline

---

## Author

**Manav Shailendra Lade**
📧 [manavlade14690@gmail.com](mailto:manavlade14690@gmail.com)
🐙 [github.com/manavlade/InferFlow](https://github.com/manavlade/InferFlow)