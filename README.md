# InferFlow 🚀

A lightweight LLM inference logging and ingestion system with a multi-turn chatbot, real-time streaming, multi-provider support, and an observability dashboard.

**Live Demo:** [https://infer-flow-fmgj.vercel.app/](https://infer-flow-fmgj.vercel.app/)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Schema Design](#schema-design)
- [Setup Instructions](#setup-instructions)
- [Ingestion Flow](#ingestion-flow)
- [Logging Strategy](#logging-strategy)
- [Scaling Considerations](#scaling-considerations)
- [Failure Handling](#failure-handling)
- [Tradeoffs Made](#tradeoffs-made)
- [What I Would Improve](#what-i-would-improve)
- [Author](#author)

---

## Features

- ✅ Multi-turn chatbot with conversational context
- ✅ Streaming responses (SSE) with stop functionality
- ✅ Multi-provider support (Gemini 2.5 Flash + Groq Llama 3.3)
- ✅ Lightweight SDK wrapper capturing inference metadata
- ✅ Real-time log ingestion pipeline
- ✅ PII redaction before storage
- ✅ Latency, throughput and error observability dashboard
- ✅ Conversation management (list, resume, cancel, delete)
- ✅ Docker Compose one-command setup

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript + Vite + Tailwind CSS |
| Backend | FastAPI (Python) |
| Database | MongoDB Atlas |
| LLM Providers | Google Gemini 2.5 Flash, Groq Llama 3.3 70B |
| Containerization | Docker + Docker Compose |
| Deployment | Vercel (Frontend) + Railway (Backend) |

---

## Architecture Overview
User (Browser)
│
▼
React Frontend (Vite + Tailwind)
│
│  POST /chat/stream (SSE)
│  GET  /conversations
│  GET  /logs
▼
FastAPI Backend
│
├── chat_service.py        → manages conversation state
│
├── gemini_service.py      → Gemini streaming + logging
├── groq_service.py        → Groq streaming + logging
│
├── pii_redactor.py        → regex PII redaction
│
├── log_service.py         → ingestion + storage
│
└── MongoDB Atlas
├── chats             → conversations + messages
└── inference_logs    → metadata per request

---

## Schema Design

### `chats` Collection
```json
{
  "_id": "ObjectId",
  "title": "First 30 chars of first message",
  "messages": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ],
  "provider": "gemini | groq",
  "model": "gemini-2.5-flash | llama-3.3-70b-versatile",
  "status": "active | cancelled",
  "created_at": "ISODate"
}
```

### `inference_logs` Collection
```json
{
  "_id": "ObjectId",
  "conversation_id": "string",
  "provider": "gemini | groq",
  "model": "string",
  "latency": 1.23,
  "prompt_tokens": 120,
  "completion_tokens": 80,
  "total_tokens": 200,
  "status": "success | error",
  "input_preview": "First 100 chars (PII redacted)",
  "output_preview": "First 100 chars (PII redacted)",
  "error_message": "null | string",
  "created_at": "ISODate"
}
```

### Design Decisions
- **MongoDB over SQL** — flexible schema for messages array, no joins needed, easy horizontal scaling
- **Messages embedded in chat document** — conversations are always read together, embedding avoids extra queries
- **Inference logs as separate collection** — logs are append-only, high write volume, queried independently for dashboard
- **Indexes on `created_at` and `conversation_id`** — fast dashboard queries and log lookups

---

## Setup Instructions

### Prerequisites
- Docker + Docker Desktop
- Git

### 1. Clone the repository
```bash
git clone https://github.com/manavlade/InferFlow.git
cd InferFlow
```

### 2. Create `.env` file in root
```env
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/inferflow
```

Get your keys:
- Gemini → [aistudio.google.com](https://aistudio.google.com)
- Groq → [console.groq.com](https://console.groq.com)
- MongoDB Atlas → [mongodb.com/atlas](https://mongodb.com/atlas) (free tier)

### 3. One-command startup
```bash
docker-compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |

### 4. Stop
```bash
docker-compose down
```

---

## Ingestion Flow

User sends message via React UI
Frontend calls POST /chat/stream with:
{ message, conversation_id, provider }
chat_service.py:

Redacts PII from message
Creates or fetches conversation from MongoDB
Saves user message to DB


gemini_service.py / groq_service.py:

Calls LLM with streaming enabled
Yields SSE chunks back to frontend in real time
Accumulates full response


After stream completes:

Saves assistant message to MongoDB
Fires log_service.ingest_log() with:
{ latency, tokens, status, previews, provider, model }


log_service.py:

Redacts PII from previews
Adds created_at timestamp
Inserts into inference_logs collection


Dashboard reads from inference_logs

Per-provider breakdown
Latency, token usage, error rates




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

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + TypeScript + Vite + Tailwind CSS |
| Backend | FastAPI (Python) |
| Database | MongoDB Atlas |
| LLM Providers | Google Gemini 2.5 Flash, Groq Llama 3.3 70B |
| Containerization | Docker + Docker Compose |
| Deployment | Vercel (Frontend) + Railway (Backend) |

---

## Architecture Overview
