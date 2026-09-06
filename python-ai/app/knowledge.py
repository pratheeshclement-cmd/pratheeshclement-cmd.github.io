"""
Verified Pratheesh Clement Portfolio Knowledge Base
Contains strictly canonical, verified facts sourced from portfolio data.
Zero fabrication policy: Do not invent employers, clients, or credentials.
"""

from typing import Dict, List, Any

PORTFOLIO_KNOWLEDGE: Dict[str, Any] = {
    "identity": {
        "name": "Pratheesh Clement",
        "legal_name": "Mariya Pratheesh",
        "title": "Digital Marketing Specialist & AI Enthusiast",
        "tagline": "Sacrifice is the brilliant move",
        "subtitle": "AI + Marketing + Development",
        "location": "Vadalur, Tamil Nadu, India",
        "timezone": "IST (UTC+5:30)",
        "remote": True,
        "availability": "Available for full-time roles, freelance projects, and remote collaboration globally",
        "summary": (
            "Pratheesh Clement is a multidisciplinary digital specialist based in Vadalur, "
            "Tamil Nadu, India. He bridges the gap between technology and growth strategy, "
            "combining modern frontend web development (React/TypeScript), technical SEO, "
            "high-ROI Google & Meta ad campaigns, and AI automation workflows."
        ),
    },
    "contact": {
        "email": "pratheesh.clement@gmail.com",
        "phone": "+91 8667876102",
        "whatsapp": "+91 8667876102",
        "location": "Vadalur, Tamil Nadu, India",
        "github": "https://github.com/pratheeshclement-cmd",
        "linkedin": "https://www.linkedin.com/in/mariya-pratheesh-5b8a9b316/",
        "portfolio": "https://pratheeshclement-cmd.github.io/",
        "response_time": "Typically within 24 hours",
    },
    "skills": {
        "technical_seo": [
            "Technical site audits",
            "Structured data & JSON-LD Schema markup",
            "Core Web Vitals optimization (LCP, INP, CLS)",
            "XML sitemaps & crawl budget optimization",
            "Google Search Console & Google Analytics 4 (GA4)",
            "Robots.txt architecture & canonicalization",
        ],
        "paid_advertising": [
            "Google Search & Display Ads",
            "Meta Ads (Facebook & Instagram campaigns)",
            "Conversion tracking & Meta Pixel setup with Custom Events",
            "A/B split testing & ad creative copy",
            "Retargeting funnels & Lookalike Audiences",
            "ROAS & CAC optimization",
        ],
        "web_development": [
            "React 19 & Next.js",
            "TypeScript & modern ESNext JavaScript",
            "Vite build tool & static prerendering",
            "Semantic HTML5 & modern CSS Grid/Flexbox",
            "Responsive & accessible UI architecture (WCAG)",
            "Three.js 3D scenes & GSAP/Anime.js micro-animations",
        ],
        "ai_automation": [
            "OpenAI, Google Gemini, and Claude API integrations",
            "Prompt engineering & conversational assistants",
            "Zapier & webhook-driven workflow automation",
            "Automated performance reporting pipelines",
        ],
        "ui_ux_design": [
            "Figma wireframing & rapid prototyping",
            "Adobe Photoshop asset preparation",
            "Design systems & typography scale",
            "User journey mapping & high-converting landing page design",
        ],
    },
    "experience": [
        {
            "id": "jbhl",
            "company": "JBHL Pvt Ltd",
            "role": "Digital Marketer",
            "period": "Current",
            "current": True,
            "description": (
                "Leading digital marketing initiatives, technical SEO strategy, online brand growth, "
                "and conversion campaigns. Responsible for end-to-end campaign planning, performance tracking "
                "via GA4, and managing Google Ads and Meta Ads accounts."
            ),
        },
        {
            "id": "nexteer",
            "company": "Nexteer Automotive India Pvt Ltd",
            "role": "Store / Production Associate",
            "period": "Chennai",
            "current": False,
            "description": (
                "Managed warehouse layouts, tracked raw materials inventory, coordinated parts supply, "
                "and collaborated with floor supervisors to prevent assembly halts at a tier-1 global "
                "automotive steering systems manufacturer. Built rigorous operational discipline, layout "
                "planning, and systemic attention to detail."
            ),
        },
    ],
    "education_and_certifications": {
        "degree": {
            "title": "Bachelor of Computer Applications (BCA)",
            "focus": "Software engineering, database architecture, algorithms, data structures, and web technologies",
            "status": "Completed",
        },
        "certifications": [
            {
                "title": "Fundamentals of Digital Marketing",
                "issuer": "Google Skillshop",
                "accreditation": "Interactive Advertising Bureau (IAB) Europe & The Open University",
                "credential_id": "453421024",
                "status": "Verified",
                "topics": "Search engine ranking, content strategy, analytics tracks, display marketing, and campaign architecture",
            }
        ],
    },
    "services": [
        "Website Development (React / Next.js / TypeScript)",
        "Technical SEO & Core Web Vitals Optimization",
        "Google Search & Display Advertising",
        "Meta Ads & Custom Conversion Tracking",
        "Full-Funnel Digital Marketing Strategy",
        "High-Converting Landing Page Design & UI/UX",
        "Website Performance & Speed Audits",
        "AI Workflow Automation & Chatbot Integrations",
        "Personal Branding & Digital Positioning",
    ],
    "projects": [
        {
            "id": "seo-growth-campaign",
            "title": "SEO Growth Campaign",
            "category": "Technical SEO & Schema Rebuild",
            "highlights": "Comprehensive technical audit, JSON-LD structured data implementation, and indexation fixes for an Indian e-commerce platform.",
        },
        {
            "id": "restaurant-branding-web",
            "title": "Restaurant Branding & Web Layout",
            "category": "UI/UX & Web Development",
            "highlights": "Interactive digital menu with responsive CSS Grid layouts, mobile-first touch controls, and high-performance branding.",
        },
        {
            "id": "b2b-conversion-funnel",
            "title": "B2B Social Lead Funnel",
            "category": "Paid Acquisition & Meta Ads",
            "highlights": "End-to-end B2B Meta Ads strategy with custom pixel conversion events, retargeting layers, and high-intent lead forms.",
        },
        {
            "id": "pratheesh-os",
            "title": "Pratheesh OS (Portfolio X)",
            "category": "Cinematic Web Application",
            "highlights": "A high-performance portfolio ecosystem engineered with React 19, TypeScript, Three.js 3D canvas, GSAP timeline, and static prerendering.",
        },
    ],
}
