# Pratheesh OS — Conversational Portfolio AI Concierge (Python FastAPI)

This service provides an intelligent, context-aware conversational Q&A engine for Pratheesh Clement's portfolio. It runs a deterministic, zero-fabrication knowledge retrieval pipeline that serves answers tailored to 5 user personas (Recruiter, Founder, Client, Developer, Just Browsing) along with contextual follow-up questions.

---

## Architecture Overview

```
GitHub Pages (Static Hosting)
        ↓
React 19 + TypeScript + Vite Frontend
        ↓
AI Concierge Component (Unified Q&A Pipeline)
        ↓  (HTTP POST /api/chat via VITE_AI_API_URL)
Python FastAPI Service (Independent Backend)
        ↓
Structured Portfolio Knowledge Base (Zero Fabrication)
        ↓
Answer + Contextual Follow-Up Suggestions (JSON)
        ↓
React UI (Active Follow-up Chips & Continuous Q&A)
```

> **IMPORTANT ARCHITECTURAL DISTINCTION:**
> - **GitHub Pages:** Static hosting only. Python code does **not** execute inside GitHub Pages.
> - **Local Development:** The React frontend connects to `http://localhost:8000/api/chat` (or `VITE_AI_API_URL`).
> - **Production:** The FastAPI application is deployed to an external cloud container (e.g. Render, Railway, Fly.io, AWS Lambda, or GCP Cloud Run), and its public URL is provided to the frontend via `VITE_AI_API_URL`.
> - **Offline / Fallback:** If the external API is offline or unreachable, the frontend gracefully alerts the visitor and provides direct portfolio contact links without fabricating a fake API response.

---

## Local Development Setup

### Option 1: Using `uv` (Recommended)

```bash
cd "d:/Pratheesh os/python-ai"

# Run tests
& "$HOME\.local\bin\uv.exe" run --with-requirements requirements.txt pytest tests/ -v

# Start the server locally on port 8000
& "$HOME\.local\bin\uv.exe" run --with-requirements requirements.txt uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Option 2: Standard Python Virtual Environment

```bash
cd python-ai
python -m venv .venv
source .venv/bin/activate  # Or on Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Run tests
pytest tests/ -v

# Start server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

---

## API Contract

### 1. Health Check
- **Endpoint:** `GET /health`
- **Response:**
  ```json
  {
    "status": "ok",
    "service": "pratheesh-portfolio-ai",
    "version": "1.0.0"
  }
  ```

### 2. Conversational Chat
- **Endpoint:** `POST /api/chat`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "persona": "recruiter",
    "messages": [
      {
        "role": "user",
        "content": "What are Pratheesh's strongest skills?"
      }
    ]
  }
  ```
- **Response Body:**
  ```json
  {
    "answer": "Pratheesh's core expertise spans 5 key pillars:\n1. Technical SEO...\n2. Paid Advertising...",
    "suggestedQuestions": [
      "Tell me about his work experience",
      "What certifications does he hold?",
      "Which projects demonstrate those skills?",
      "How do I contact Pratheesh for hiring?"
    ],
    "topic": "skills"
  }
  ```

---

## Production Deployment Guide

Deploying this FastAPI service takes only a few minutes on modern cloud platforms:

### Deploying to Render / Railway / Fly.io:
1. Root directory: `python-ai`
2. Build command: `pip install -r requirements.txt`
3. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Set environment variable: `CORS_ORIGINS=https://pratheeshclement-cmd.github.io`
5. Once deployed, set in the GitHub repository / hosting environment:
   ```env
   VITE_AI_API_URL=https://your-fastapi-service.onrender.com
   ```
