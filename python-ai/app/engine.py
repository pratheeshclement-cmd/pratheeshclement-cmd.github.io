"""
Conversational Portfolio Q&A Reasoning Engine
Provides deterministic topic classification, persona-tailored answers,
conversation context resolution, and dynamic follow-up question generation.
Zero fabrication policy enforced.
"""

import re
from typing import List, Tuple
from .knowledge import PORTFOLIO_KNOWLEDGE
from .models import ChatMessage


TOPIC_KEYWORDS = {
    "contact": [
        "contact", "email", "phone", "whatsapp", "reach", "hire", "available",
        "availability", "freelance", "full-time", "remote", "location", "where",
        "vadalur", "chennai", "timezone", "ist", "connect", "get in touch", "talk",
        "call", "schedule", "interview"
    ],
    "pricing": [
        "price", "cost", "rate", "rates", "quote", "budget", "charge", "pricing",
        "fee", "fees", "how much", "estimate"
    ],
    "experience": [
        "experience", "work", "job", "career", "history", "background", "company",
        "companies", "jbhl", "nexteer", "associate", "store", "production",
        "employment", "roles", "worked"
    ],
    "certifications": [
        "certification", "certifications", "certificate", "certificates", "google",
        "skillshop", "credential", "credentials", "degree", "education", "bca",
        "qualification", "accredited", "iab", "open university"
    ],
    "projects": [
        "project", "projects", "portfolio", "case study", "case studies", "built",
        "ecommerce", "restaurant", "b2b", "funnel", "work done", "examples",
        "showcase", "pratheesh os", "demos"
    ],
    "services": [
        "service", "services", "offer", "offerings", "help", "what do you do",
        "what can he do", "capabilities", "solutions", "packages", "consulting"
    ],
    "seo": [
        "seo", "technical seo", "search engine", "ranking", "rank", "schema",
        "json-ld", "sitemap", "core web vitals", "crawl", "crawlability",
        "google search console", "gsc", "meta tags", "indexation"
    ],
    "paid_ads": [
        "ads", "ad", "paid", "google ads", "meta ads", "facebook ads", "instagram ads",
        "pixel", "conversion", "roas", "campaign", "campaigns", "ppc", "retargeting",
        "lookalike", "tracking"
    ],
    "ai_automation": [
        "ai", "artificial intelligence", "automation", "automate", "workflow",
        "workflows", "chatbot", "chatbots", "zapier", "openai", "gemini", "claude",
        "webhook", "prompt", "concierge"
    ],
    "ui_ux": [
        "ui", "ux", "ui/ux", "design", "figma", "photoshop", "wireframe", "wireframes",
        "prototype", "prototyping", "visual", "layout", "user experience", "user interface"
    ],
    "web_dev": [
        "web development", "react", "typescript", "vite", "next.js", "nextjs",
        "html", "css", "three.js", "threejs", "frontend", "code", "coding",
        "programming", "stack", "tech stack", "javascript"
    ],
    "skills": [
        "skill", "skills", "strongest", "expertise", "proficient", "expert",
        "tools", "technologies", "strengths", "what does he know"
    ],
    "bio": [
        "who is", "who are you", "about pratheesh", "introduction", "intro",
        "bio", "name", "tagline", "motto", "story", "philosophy", "himself",
        "what does he do", "what he does", "what do you do", "background overview"
    ],
}


def classify_topic(query: str, history: List[ChatMessage]) -> str:
    """
    Classify query into a core portfolio topic using keyword analysis and context.
    """
    q = query.lower().strip()
    words = set(re.findall(r"\b[a-z0-9\-]+\b", q))

    # Helper to find the most recent valid topic discussed in history
    def get_last_topic() -> str:
        for msg in reversed(history[:-1]):
            if msg.role == "assistant":
                for t, kws in TOPIC_KEYWORDS.items():
                    if any(kw in msg.content.lower() for kw in kws[:4]):
                        return t
        return "skills"

    # 1. Check for conversational continuation phrases
    continuation_phrases = [
        "tell me more", "more details", "elaborate", "what about that",
        "tell me more about that", "how does that help", "how does that help clients",
        "can you explain further", "give me more info"
    ]
    if any(p in q for p in continuation_phrases):
        return get_last_topic()

    # 2. Check for "example" / "best example"
    if "best example" in q or "example" in words or "examples" in words:
        return "projects"

    # 3. Check for "technologies used in projects" or "stack used"
    if ("technology" in words or "technologies" in words or "tech" in words or "stack" in words) and ("project" in words or "projects" in words or "those" in words):
        return "web_dev"

    # 4. Check for custom projects / client work inquiries
    if "custom project" in q or "custom work" in q or "build for a client" in q or "build something similar" in q or "build something" in q:
        return "services"

    # 5. Check for referential pronouns like "those skills", "that experience", "those projects"
    if any(w in words for w in ["those", "that", "these", "it", "them"]):
        last_topic = get_last_topic()
        if "project" in q or "demonstrate" in q or "built" in q or "show" in q:
            return "projects"
        if "certif" in q or "credential" in q:
            return "certifications"
        if "contact" in q or "reach" in q or "hire" in q:
            return "contact"
        if "technology" in q or "stack" in q or "tool" in q:
            return "skills"
        if last_topic:
            return last_topic

    # 6. Score topics based on keyword matching
    scores = {topic: 0 for topic in TOPIC_KEYWORDS}
    for topic, kws in TOPIC_KEYWORDS.items():
        for kw in kws:
            if kw in q:
                scores[topic] += 4 if len(kw.split()) > 1 else 2
            elif kw in words:
                scores[topic] += 2

    # Find highest scoring topic
    best_topic, best_score = max(scores.items(), key=lambda item: item[1])
    if best_score > 0:
        return best_topic

    return "unknown"


def generate_answer(topic: str, persona: str, query: str) -> Tuple[str, str]:
    """
    Generate a factual, verified answer based on topic, persona, and query.
    Returns (answer_text, actual_topic).
    """
    identity = PORTFOLIO_KNOWLEDGE["identity"]
    contact = PORTFOLIO_KNOWLEDGE["contact"]
    skills = PORTFOLIO_KNOWLEDGE["skills"]
    exp = PORTFOLIO_KNOWLEDGE["experience"]
    edu_cert = PORTFOLIO_KNOWLEDGE["education_and_certifications"]
    services = PORTFOLIO_KNOWLEDGE["services"]
    projects = PORTFOLIO_KNOWLEDGE["projects"]

    p = persona.lower()

    if topic == "skills" or topic == "web_dev":
        if p == "developer":
            ans = (
                "Pratheesh's frontend development stack centers on React 19, TypeScript, and Vite, "
                "supplemented with Next.js for server-rendered web applications. For visuals and interactive UX, "
                "he engineers 3D canvases using Three.js and crafts fluid timelines with GSAP and Anime.js. "
                "He also applies technical SEO architectures and integrates OpenAI/Gemini/Claude APIs."
            )
        elif p == "founder":
            ans = (
                "Pratheesh combines technical web development with commercial growth. He builds fast, conversion-optimized "
                "web platforms using React and Next.js, designs high-converting landing pages, optimizes technical SEO "
                "for organic search discovery, and sets up high-ROI Google Search and Meta Ad funnels with precision conversion tracking."
            )
        else:
            ans = (
                "Pratheesh's core expertise spans 5 key pillars:\n"
                "1. Technical SEO: Schema markup, Core Web Vitals, site architecture, and GA4/GSC analytics.\n"
                "2. Paid Advertising: Google Search & Display Ads, Meta Ads with custom pixel tracking & ROAS optimization.\n"
                "3. Web Development: React 19, TypeScript, Vite, Next.js, and modern CSS Grid.\n"
                "4. AI & Automation: Workflow automations with Zapier, webhooks, and OpenAI/Gemini/Claude API integrations.\n"
                "5. UI/UX Design: Figma wireframes, design systems, and conversion-focused landing pages."
            )
        return ans, "skills"

    elif topic == "experience":
        jbhl = exp[0]
        nexteer = exp[1]
        ans = (
            f"Pratheesh's verified career history includes:\n\n"
            f"1. {jbhl['role']} at {jbhl['company']} ({jbhl['period']}):\n"
            f"{jbhl['description']}\n\n"
            f"2. {nexteer['role']} at {nexteer['company']} ({nexteer['period']}):\n"
            f"{nexteer['description']}"
        )
        return ans, "experience"

    elif topic == "certifications":
        deg = edu_cert["degree"]
        cert = edu_cert["certifications"][0]
        ans = (
            f"Pratheesh holds verified academic and industry qualifications:\n\n"
            f"• {cert['title']} — {cert['issuer']}\n"
            f"  Accreditation: {cert['accreditation']}\n"
            f"  Credential ID: {cert['credential_id']} (Status: {cert['status']})\n"
            f"  Core Focus: {cert['topics']}\n\n"
            f"• {deg['title']}\n"
            f"  Academic Focus: {deg['focus']} (Status: {deg['status']})"
        )
        return ans, "certifications"

    elif topic == "projects":
        proj_lines = [f"{i+1}. {p['title']} ({p['category']}): {p['highlights']}" for i, p in enumerate(projects)]
        ans = "Here are Pratheesh's featured case studies and projects:\n\n" + "\n\n".join(proj_lines)
        return ans, "projects"

    elif topic == "services":
        serv_lines = [f"{i+1}. {s}" for i, s in enumerate(services)]
        ans = "Pratheesh offers 9 specialized digital services:\n" + "\n".join(serv_lines)
        return ans, "services"

    elif topic == "seo":
        seo_items = skills["technical_seo"]
        ans = (
            "Pratheesh specializes in Technical SEO, focusing on search architecture and performance:\n"
            + "\n".join(f"• {item}" for item in seo_items)
            + "\n\nHis approach ensures sites are fully crawlable, indexable, and score top Core Web Vitals marks."
        )
        return ans, "seo"

    elif topic == "paid_ads":
        ads_items = skills["paid_advertising"]
        ans = (
            "Pratheesh manages end-to-end paid acquisition campaigns across Google and Meta:\n"
            + "\n".join(f"• {item}" for item in ads_items)
            + "\n\nHe emphasizes conversion tracking, custom pixel events, and measurable ROAS."
        )
        return ans, "paid_ads"

    elif topic == "ai_automation":
        ai_items = skills["ai_automation"]
        ans = (
            "Pratheesh integrates AI and automation to streamline operations:\n"
            + "\n".join(f"• {item}" for item in ai_items)
            + "\n\nHe connects LLM APIs (OpenAI, Gemini, Claude) with webhook pipelines and automated analytics."
        )
        return ans, "ai_automation"

    elif topic == "ui_ux":
        ui_items = skills["ui_ux_design"]
        ans = (
            "Pratheesh applies a conversion-driven UI/UX design process:\n"
            + "\n".join(f"• {item}" for item in ui_items)
            + "\n\nHe designs interfaces that are aesthetically compelling, accessible, and structured to convert visitors into clients."
        )
        return ans, "ui_ux"

    elif topic == "contact":
        ans = (
            f"You can contact Pratheesh Clement directly:\n\n"
            f"• Email: {contact['email']}\n"
            f"• Phone / WhatsApp: {contact['whatsapp']}\n"
            f"• Location: {contact['location']} ({identity['timezone']})\n"
            f"• Response Time: {contact['response_time']}\n"
            f"• GitHub: {contact['github']}\n"
            f"• LinkedIn: {contact['linkedin']}\n\n"
            f"Pratheesh is {identity['availability'].lower()}."
        )
        return ans, "contact"

    elif topic == "pricing":
        ans = (
            "Pricing depends on the scope, technical complexity, and timeline of each project. "
            "Whether you need technical SEO, ad campaign management, custom web development, or AI automation, "
            f"contact Pratheesh at {contact['email']} or WhatsApp {contact['whatsapp']} with your requirements "
            "for a customized proposal and transparent deliverables breakdown."
        )
        return ans, "pricing"

    elif topic == "bio":
        ans = (
            f"{identity['name']} ({identity['title']}) is based in {identity['location']}.\n\n"
            f"Tagline: \"{identity['tagline']}\"\n\n"
            f"{identity['summary']}\n\n"
            f"Status: {identity['availability']}."
        )
        return ans, "bio"

    else:
        ans = (
            "I don't have verified information about that specific inquiry in Pratheesh's portfolio. "
            "I can provide verified details regarding his technical skills, work experience at JBHL & Nexteer, "
            "Google Skillshop certification, featured case studies, service offerings, or direct contact details."
        )
        return ans, "unknown"


def generate_follow_ups(topic: str, persona: str) -> List[str]:
    """
    Generate 2 to 4 contextual follow-up questions tailored to topic and persona.
    """
    p = persona.lower()

    if topic == "skills" or topic == "web_dev":
        if p == "recruiter":
            return [
                "Tell me about his work experience",
                "What certifications does he hold?",
                "Which projects demonstrate those skills?",
                "How do I contact Pratheesh for hiring?",
            ]
        elif p == "founder":
            return [
                "Which projects demonstrate those skills?",
                "What marketing & ad services does he offer?",
                "How can he help my business grow?",
            ]
        elif p == "developer":
            return [
                "How was this portfolio engineered?",
                "Where can I see his GitHub projects?",
                "What AI tools does he work with?",
            ]
        else:
            return [
                "Which projects demonstrate those skills?",
                "What services does Pratheesh offer?",
                "What certifications does he have?",
            ]

    elif topic == "experience":
        return [
            "What are Pratheesh's strongest skills?",
            "What certifications does he hold?",
            "Show me his featured case studies",
            "Is Pratheesh available for hire?",
        ]

    elif topic == "certifications":
        return [
            "Which skills do those certifications support?",
            "Tell me about his work experience",
            "What projects demonstrate those skills?",
            "How can I contact Pratheesh?",
        ]

    elif topic == "projects":
        return [
            "What technologies were used in those projects?",
            "What services does Pratheesh offer?",
            "Can Pratheesh build a custom project for me?",
            "How do I contact Pratheesh?",
        ]

    elif topic == "services":
        return [
            "Can he optimize my website SEO & speed?",
            "How does paid ad campaign management work?",
            "How do project pricing and timelines work?",
            "How can I contact Pratheesh?",
        ]

    elif topic in ["seo", "paid_ads"]:
        return [
            "Can you show an SEO or ads project?",
            "What tools does he use for campaigns?",
            "What other services does he provide?",
            "How can I contact him?",
        ]

    elif topic == "ai_automation":
        return [
            "How can AI automation help my business?",
            "What web development stack does he use?",
            "How can I start a project with Pratheesh?",
        ]

    elif topic == "ui_ux":
        return [
            "Show me his design & web projects",
            "What services does he offer?",
            "How can I contact Pratheesh?",
        ]

    elif topic in ["contact", "pricing"]:
        return [
            "What are Pratheesh's strongest skills?",
            "What services does he offer?",
            "Show me his featured case studies",
            "What certifications does he hold?",
        ]

    else:  # unknown or bio
        return [
            "What are Pratheesh's strongest skills?",
            "What services does he provide?",
            "Tell me about his work experience",
            "How do I contact Pratheesh?",
        ]


def process_chat(persona: str, messages: List[ChatMessage]) -> Tuple[str, List[str], str]:
    """
    Main entry point for processing a chat request.
    Returns (answer, suggested_questions, topic).
    """
    if not messages:
        return "Hi! I'm Pratheesh's Portfolio AI. How can I help you today?", [
            "What are Pratheesh's strongest skills?",
            "What services does he offer?",
            "Tell me about his work experience",
            "How can I contact him?"
        ], "intro"

    last_user_msg = next((m for m in reversed(messages) if m.role == "user"), None)
    if not last_user_msg or not last_user_msg.content.strip():
        return "Please ask a question about Pratheesh's skills, projects, experience, or services.", [
            "What are Pratheesh's strongest skills?",
            "What services does he offer?",
            "How can I contact him?"
        ], "prompt"

    query = last_user_msg.content.strip()

    # Classify topic using query and conversation history
    topic = classify_topic(query, messages)

    # Generate answer
    answer, final_topic = generate_answer(topic, persona, query)

    # Generate contextual follow-ups
    follow_ups = generate_follow_ups(final_topic, persona)

    return answer, follow_ups, final_topic
