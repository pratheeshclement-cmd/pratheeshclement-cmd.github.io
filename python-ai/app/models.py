from typing import List, Literal, Optional
from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"] = Field(..., description="Message author role")
    content: str = Field(..., min_length=1, max_length=2000, description="Message text content")
    timestamp: Optional[int] = Field(None, description="Client timestamp in milliseconds")


class ChatRequest(BaseModel):
    persona: str = Field(
        default="browsing",
        description="Active persona: recruiter, founder, client, developer, browsing"
    )
    messages: List[ChatMessage] = Field(
        ...,
        min_length=1,
        max_length=50,
        description="Conversation history including current user question"
    )


class ChatResponse(BaseModel):
    answer: str = Field(..., description="Contextual verified portfolio answer")
    suggestedQuestions: List[str] = Field(
        default_factory=list,
        description="2 to 4 contextual follow-up questions"
    )
    topic: str = Field(..., description="Classified conversation topic")


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
