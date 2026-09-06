"""
FastAPI Server for Pratheesh OS Conversational Portfolio AI Concierge
Provides HTTP POST /api/chat endpoint and GET /health.
"""

import os
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from .models import ChatRequest, ChatResponse, HealthResponse
from .engine import process_chat

app = FastAPI(
    title="Pratheesh OS Portfolio AI Engine",
    description="Conversational portfolio Q&A service providing verified facts and contextual guidance.",
    version="1.0.0",
)

# CORS configuration: allows production GitHub Pages domain and local development origins by default
raw_origins = os.getenv(
    "CORS_ORIGINS",
    "https://pratheeshclement-cmd.github.io,http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000"
)
ALLOWED_ORIGINS = [orig.strip() for orig in raw_origins.split(",") if orig.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthResponse)
def health_check():
    return {
        "status": "ok",
        "service": "pratheesh-portfolio-ai",
        "version": "1.0.0",
    }


@app.post("/api/chat", response_model=ChatResponse)
def chat_endpoint(payload: ChatRequest):
    try:
        # Request validation
        if not payload.messages:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Messages array must contain at least one message."
            )

        # Process conversation through deterministic reasoning engine
        answer, follow_ups, topic = process_chat(payload.persona, payload.messages)

        return {
            "answer": answer,
            "suggestedQuestions": follow_ups,
            "topic": topic,
        }

    except HTTPException:
        raise
    except Exception as err:
        # Avoid leaking internal stack traces to clients
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while processing the conversation."
        ) from err


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run(app, host="0.0.0.0", port=port)
