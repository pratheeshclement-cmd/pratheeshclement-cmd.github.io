"""
Persona instructions and recommended questions for Portfolio AI Concierge.
"""

from typing import Dict, List

PERSONA_CHIPS: Dict[str, List[str]] = {
    "recruiter": [
        "What are Pratheesh's strongest skills?",
        "Tell me about his work experience",
        "What certifications does he hold?",
        "Is Pratheesh available for hire?",
    ],
    "founder": [
        "How can Pratheesh help my business grow?",
        "What marketing & ad services does he offer?",
        "Can he automate workflows using AI?",
        "How do I start a project with him?",
    ],
    "client": [
        "What services does Pratheesh provide?",
        "Can he optimize my website's SEO & speed?",
        "How do project pricing and timelines work?",
        "How can I contact Pratheesh?",
    ],
    "developer": [
        "What is Pratheesh's tech stack?",
        "How was this portfolio engineered?",
        "Does he work with React, TypeScript & Three.js?",
        "Where can I see his GitHub projects?",
    ],
    "browsing": [
        "Who is Pratheesh Clement?",
        "Show me his featured projects",
        "What digital services does he offer?",
        "How do I get in touch?",
    ],
}
