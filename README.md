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