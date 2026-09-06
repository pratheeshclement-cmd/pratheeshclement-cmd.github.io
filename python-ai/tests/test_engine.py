"""
Comprehensive Unit and Integration Tests for Pratheesh OS AI Engine
"""

import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.models import ChatMessage
from app.engine import process_chat, classify_topic, generate_answer, generate_follow_ups
from app.knowledge import PORTFOLIO_KNOWLEDGE


client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "pratheesh-portfolio-ai"


def test_recruiter_skills():
    messages = [ChatMessage(role="user", content="What are Pratheesh's strongest skills?")]
    answer, follow_ups, topic = process_chat("recruiter", messages)
    assert topic == "skills"
    assert "Technical SEO" in answer
    assert "Paid Advertising" in answer
    assert "Web Development" in answer
    assert len(follow_ups) >= 2


def test_recruiter_experience():
    messages = [ChatMessage(role="user", content="Tell me about his work experience")]
    answer, follow_ups, topic = process_chat("recruiter", messages)
    assert topic == "experience"
    assert "JBHL Pvt Ltd" in answer
    assert "Nexteer Automotive" in answer
    assert len(follow_ups) >= 2


def test_recruiter_certifications():
    messages = [ChatMessage(role="user", content="What certifications does he hold?")]
    answer, follow_ups, topic = process_chat("recruiter", messages)
    assert topic == "certifications"
    assert "Google Skillshop" in answer
    assert "453421024" in answer
    assert "Bachelor of Computer Applications" in answer
    assert len(follow_ups) >= 2


def test_founder_business_growth():
    messages = [ChatMessage(role="user", content="How can Pratheesh help my business grow?")]
    answer, follow_ups, topic = process_chat("founder", messages)
    assert "conversion" in answer.lower() or "growth" in answer.lower()
    assert len(follow_ups) >= 2


def test_founder_marketing_ads():
    messages = [ChatMessage(role="user", content="What marketing & ad services does he offer?")]
    answer, follow_ups, topic = process_chat("founder", messages)
    assert "Google" in answer or "Meta" in answer
    assert len(follow_ups) >= 2


def test_client_services():
    messages = [ChatMessage(role="user", content="What services does Pratheesh provide?")]
    answer, follow_ups, topic = process_chat("client", messages)
    assert topic == "services"
    assert "Website Development" in answer
    assert "Technical SEO" in answer
    assert len(follow_ups) >= 2


def test_client_pricing():
    messages = [ChatMessage(role="user", content="How much does a project cost?")]
    answer, follow_ups, topic = process_chat("client", messages)
    assert topic == "pricing"
    assert "pratheesh.clement@gmail.com" in answer
    assert len(follow_ups) >= 2


def test_developer_tech_stack():
    messages = [ChatMessage(role="user", content="What is Pratheesh's tech stack?")]
    answer, follow_ups, topic = process_chat("developer", messages)
    assert "React 19" in answer
    assert "TypeScript" in answer
    assert "Vite" in answer
    assert len(follow_ups) >= 2


def test_developer_portfolio_engineering():
    messages = [ChatMessage(role="user", content="How was this portfolio engineered?")]
    answer, follow_ups, topic = process_chat("developer", messages)
    assert "React" in answer or "Three.js" in answer
    assert len(follow_ups) >= 2


def test_browsing_intro():
    messages = [ChatMessage(role="user", content="Who is Pratheesh Clement?")]
    answer, follow_ups, topic = process_chat("browsing", messages)
    assert "Pratheesh Clement" in answer
    assert "Vadalur" in answer
    assert len(follow_ups) >= 2


def test_browsing_projects():
    messages = [ChatMessage(role="user", content="Show me his featured projects")]
    answer, follow_ups, topic = process_chat("browsing", messages)
    assert topic == "projects"
    assert "SEO Growth Campaign" in answer
    assert "Restaurant Branding" in answer
    assert len(follow_ups) >= 2


def test_conversation_context_referential_question():
    messages = [
        ChatMessage(role="user", content="What are his strongest skills?"),
        ChatMessage(role="assistant", content="Pratheesh is proficient in React 19, Technical SEO, and Paid Ads."),
        ChatMessage(role="user", content="Which projects demonstrate those skills?"),
    ]
    answer, follow_ups, topic = process_chat("recruiter", messages)
    assert topic == "projects"
    assert "SEO Growth Campaign" in answer or "Pratheesh OS" in answer


def test_unknown_question_no_fabrication():
    messages = [ChatMessage(role="user", content="What is the weather in Tokyo right now?")]
    answer, follow_ups, topic = process_chat("recruiter", messages)
    assert topic == "unknown"
    assert "verified information" in answer.lower()


def test_unverified_company_inquiry():
    messages = [ChatMessage(role="user", content="Did Pratheesh work at Microsoft or Apple?")]
    answer, follow_ups, topic = process_chat("recruiter", messages)
    # Experience answer only mentions verified employers: JBHL and Nexteer
    assert "JBHL" in answer
    assert "Nexteer" in answer


def test_fastapi_chat_api_endpoint():
    payload = {
        "persona": "recruiter",
        "messages": [
            {"role": "user", "content": "What are his strongest skills?"}
        ]
    }
    res = client.post("/api/chat", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "answer" in data
    assert "suggestedQuestions" in data
    assert len(data["suggestedQuestions"]) >= 2
    assert data["topic"] == "skills"


def test_fastapi_chat_validation_error():
    # Empty messages list should fail validation
    res = client.post("/api/chat", json={"persona": "client", "messages": []})
    assert res.status_code == 422
