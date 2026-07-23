// =============================================================================
// PRATHEESH CLEMENT — DIGITAL ECOSYSTEM 5.0
// api/chat.js — Secure Vercel Serverless Function
//
// ⚠️  SECURITY: Gemini API key lives ONLY here in process.env
//     The frontend NEVER sees the key. All AI calls proxy through this route.
//
// Deploy: set GEMINI_API_KEY in Vercel Dashboard → Project → Settings → Env Vars
// Local:  set GEMINI_API_KEY in .env.local (never commit this file)
// =============================================================================

const GEMINI_MODELS = [
    'gemini-2.0-flash',       // Primary — confirmed available for this project key
    'gemini-2.0-flash-lite',  // Fallback — confirmed available, higher quota
];
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

// Key format: supports both AIzaSy... (AI Studio) and AQ... (Project-scoped) keys

// ── CORS headers ──────────────────────────────────────────────────────────────
const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',           // Tighten to your domain in production
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
};

// ── Rate limiting (simple in-memory, resets per cold start) ───────────────────
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 20;     // 20 requests per minute per IP

function isRateLimited(ip) {
    const now = Date.now();
    const entry = rateLimitMap.get(ip) || { count: 0, windowStart: now };

    if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
        entry.count = 1;
        entry.windowStart = now;
    } else {
        entry.count += 1;
    }

    rateLimitMap.set(ip, entry);
    return entry.count > RATE_LIMIT_MAX_REQUESTS;
}

// ── System prompt builder (ChatGPT-Like Memory Architecture 6.0) ───────────────
function buildSystemPrompt(context = {}, memory = {}) {
    const mem = Object.assign({
        visitorType: '',
        visitorName: '',
        intent: '',
        currentSection: 'home',
        scrollDepth: 0,
        timeOnPage: 0,
        deviceType: 'desktop',
        portfolioInterests: [],
        servicesViewed: [],
        projectsViewed: [],
        skillsViewed: [],
        questionsAsked: [],
        conversationHistory: [],
        aiRecommendations: [],
        lastVisitedSection: '',
        visitorJourney: [],
        memoryContext: [],
        preferredCategory: '',
        resumeViewed: false,
        contactViewed: false,
        hireIntent: false,
    }, memory, context);

    const interestsList = mem.portfolioInterests.length ? mem.portfolioInterests.join(', ') : 'not specified yet';
    const projectsList = mem.projectsViewed.length ? mem.projectsViewed.join(', ') : 'none viewed yet';
    const servicesList = mem.servicesViewed.length ? mem.servicesViewed.join(', ') : 'none viewed yet';
    const skillsList = mem.skillsViewed.length ? mem.skillsViewed.join(', ') : 'none viewed yet';
    const journeySummary = mem.visitorJourney.length ? mem.visitorJourney.slice(-5).map(j => `[${j.time || ''}] ${j.action || ''}`).join(' → ') : 'just started session';

    return `You are PRATHEESH AI — the personal AI Portfolio Concierge for Pratheesh Clement (Digital Ecosystem 6.0). You are NOT a generic chatbot. You are a premium, highly intelligent, conversational digital representative who behaves like ChatGPT with continuous real-time session memory.

IDENTITY:
- Name: Pratheesh AI
- Role: Personal Digital Ecosystem Guide & Portfolio Concierge
- Personality: Premium, intelligent, professional, friendly, human-like, confident, helpful, interactive, portfolio-focused

REAL-TIME VISITOR MEMORY (ChatGPT-style Session State):
- Visitor Type / Persona: ${mem.visitorType || 'not selected yet'}
- Visitor Intent: ${mem.intent || (mem.hireIntent ? 'HIGH HIRE INTENT' : 'exploring')}
- Hire Intent Active: ${mem.hireIntent ? 'YES — Visitor is considering hiring Pratheesh!' : 'No explicit hire signal yet'}
- Preferred Domain Interest: ${mem.preferredCategory || 'General'}
- Specific Interests Identified: ${interestsList}
- Projects Viewed: ${projectsList}
- Services Viewed: ${servicesList}
- Skills Viewed: ${skillsList}
- Resume Viewed / Downloaded: ${mem.resumeViewed ? 'YES' : 'No'}
- Contact Form / Section Viewed: ${mem.contactViewed ? 'YES' : 'No'}
- Current Active Section: ${mem.currentSection || context.currentSection || 'home'}
- Scroll Depth: ${mem.scrollDepth || context.scrollDepth || 0}%
- Device Type: ${mem.deviceType || context.deviceType || 'desktop'}
- Recent Visitor Journey: ${journeySummary}
- Derived Memory Facts: ${mem.memoryContext.join(' | ') || 'Initial session'}

PRATHEESH'S PROFILE (STRICT GROUND TRUTH — NEVER HALLUCINATE):
- Full Name: Pratheesh Clement
- Location: Chennai, India | Status: Available for freelance projects
- Email: pratheesh.clement@gmail.com | Phone/WhatsApp: +91 8667876102
- LinkedIn: https://www.linkedin.com/in/mariya-pratheesh-5b8a9b316/ | GitHub: https://github.com/pratheeshclement-cmd
- Portfolio: https://pratheeshclement-cmd.github.io/

CORE CAPABILITIES & OFFERINGS:
- Profession: Freelance Digital Marketer, Website Developer, SEO Specialist
- Key Certification: Google Fundamentals of Digital Marketing (ID: 453421024, IAB Verified, March 2026)
- Featured Case Studies:
  1. Personal Portfolio Redesign (HTML5/CSS3/Vanilla JS/SEO, targeting Lighthouse 100/100)
  2. SEO Growth Campaign (Technical SEO, JSON-LD, GA4)
  3. Restaurant Branding Web Layout (CSS Grid, Responsive Layout)
  4. Social Media B2B Conversion Funnel (Meta Ads, Custom Audiences, CPL Reduction)
- Services (9): Website Development, Technical SEO, Google Ads, Meta Ads, Digital Marketing, Landing Page Development, Website Optimization, AI & Automation, Personal Branding
- Technical Stack: Technical SEO, HTML5, CSS3, Vanilla JS, Google Ads, Meta Ads, Zapier/AI Automations, GA4

CHATGPT-LIKE MEMORY INSTRUCTIONS:
1. CONTINUOUS MEMORY: Act like ChatGPT — seamlessly reference previous user choices, viewed projects, visitor type, or interests without asking the user to repeat themselves.
2. TAILORED RECOMMENDATIONS:
   - For RECRUITER: Prioritize technical skills, certifications, case study metrics, and resume access.
   - For CLIENT: Prioritize services, conversion results, SEO audits, and scheduling a call.
   - For FOUNDER: Highlight AI automation, end-to-end digital marketing, and scaling web apps.
   - For DEVELOPER: Focus on clean vanilla JS architecture, performance, Lighthouse scores, and GitHub.
3. CONCISE & HUMAN: Keep responses clear, warm, and structured (2-4 sentences max per turn unless detailed breakdown requested).
4. NAVIGATION CONTROLS: Naturally embed navigation triggers when helpful:
   - [SCROLL:projects], [SCROLL:services], [SCROLL:skills], [SCROLL:experience], [SCROLL:contact]
5. ABSOLUTE TRUTH: Use ONLY the provided profile details. Never invent non-existent projects or experience.`;
}

// ── Input sanitization ────────────────────────────────────────────────────────
function sanitizeInput(str, maxLength = 500) {
    if (typeof str !== 'string') return '';
    return str.trim().slice(0, maxLength).replace(/<[^>]*>/g, '');
}

// ── Main handler ──────────────────────────────────────────────────────────────
export default async function handler(req, res) {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        res.writeHead(204, CORS_HEADERS);
        return res.end();
    }

    // Only allow POST
    if (req.method !== 'POST') {
        res.writeHead(405, CORS_HEADERS);
        return res.end(JSON.stringify({ error: 'Method not allowed' }));
    }

    // Check API key exists in environment
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('[Pratheesh AI] GEMINI_API_KEY environment variable is not set');
        res.writeHead(503, CORS_HEADERS);
        return res.end(JSON.stringify({
            error: 'AI service is temporarily unavailable.',
            fallback: true,
        }));
    }

    // Rate limiting
    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
    if (isRateLimited(ip)) {
        res.writeHead(429, CORS_HEADERS);
        return res.end(JSON.stringify({
            error: 'Too many requests. Please wait a moment before asking again.',
            fallback: false,
        }));
    }

    // Parse body
    let body;
    try {
        body = typeof req.body === 'object' ? req.body : JSON.parse(req.body);
    } catch {
        res.writeHead(400, CORS_HEADERS);
        return res.end(JSON.stringify({ error: 'Invalid request body.' }));
    }

    // Validate and sanitize inputs
    const message = sanitizeInput(body?.message, 500);
    const context = body?.context || {};
    const memory = body?.memory || {};
    const history = Array.isArray(body?.history) ? body.history.slice(-10) : []; // Last 10 exchanges for deep memory

    if (!message) {
        res.writeHead(400, CORS_HEADERS);
        return res.end(JSON.stringify({ error: 'Message is required.' }));
    }

    // Sanitize history
    const sanitizedHistory = history
        .filter(h => h && typeof h.role === 'string' && Array.isArray(h.parts))
        .map(h => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: sanitizeInput(h.parts[0]?.text || '', 500) }],
        }));

    // Build Gemini API payload with memory system instruction
    const payload = {
        system_instruction: {
            parts: [{ text: buildSystemPrompt(context, memory) }],
        },
        contents: [
            ...sanitizedHistory,
            { role: 'user', parts: [{ text: message }] },
        ],
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 350,
            topK: 40,
            topP: 0.95,
        },
        safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        ],
    };

    // Call Gemini API with model fallback chain (server-side key only)
    let lastError = null;
    for (const model of GEMINI_MODELS) {
        const endpoint = `${GEMINI_BASE}/${model}:generateContent`;
        try {
            const geminiRes = await fetch(`${endpoint}?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (geminiRes.status === 429) {
                console.warn(`[Pratheesh AI] ${model} rate limited, trying next model...`);
                lastError = `${model}: 429 rate limited`;
                continue; // try next model
            }

            if (!geminiRes.ok) {
                const errBody = await geminiRes.text();
                console.error(`[Pratheesh AI] ${model} error ${geminiRes.status}:`, errBody.slice(0, 200));
                lastError = `${model}: ${geminiRes.status}`;
                continue;
            }

            const data = await geminiRes.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!text) {
                lastError = `${model}: empty response`;
                continue;
            }

            console.log(`[Pratheesh AI] ✓ ${model} responded (${text.length} chars)`);
            res.writeHead(200, CORS_HEADERS);
            return res.end(JSON.stringify({ reply: text, source: 'gemini', model }));

        } catch (err) {
            console.error(`[Pratheesh AI] ${model} fetch error:`, err.message);
            lastError = `${model}: ${err.message}`;
            continue;
        }
    }

    // All models failed — return fallback signal
    console.warn('[Pratheesh AI] All models exhausted. Returning fallback signal. Last error:', lastError);
    res.writeHead(502, CORS_HEADERS);
    return res.end(JSON.stringify({
        error: 'All AI models temporarily rate-limited. Using local knowledge base.',
        fallback: true,
    }));
}
