// Simple local test server for Digital Ecosystem 5.0
// Simulates the Vercel /api/chat serverless function locally
// Usage: node test-server.js
// Then open: http://localhost:3000

const http = require('http');
const fs = require('fs');
const path = require('path');

// Load .env.local
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
    fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
        const [key, ...val] = line.split('=');
        if (key && !key.startsWith('#') && val.length) {
            process.env[key.trim()] = val.join('=').trim();
        }
    });
    console.log('[env] Loaded .env.local');
}

const PORT = 3000;
const PORTFOLIO_DIR = __dirname;

// MIME types
const MIME = {
    '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
    '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon', '.webp': 'image/webp', '.woff': 'font/woff',
    '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.webmanifest': 'application/manifest+json',
};

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
};

// Import the actual api/chat handler logic inline
const GEMINI_MODELS = [
    'gemini-2.0-flash',       // Primary — confirmed available
    'gemini-2.0-flash-lite',  // Fallback — confirmed available, higher quota
];
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

function buildSystemPrompt(context = {}, memory = {}) {
    const mem = Object.assign({
        visitorType: '', visitorName: '', intent: '', currentSection: 'home',
        scrollDepth: 0, deviceType: 'desktop', portfolioInterests: [],
        servicesViewed: [], projectsViewed: [], skillsViewed: [],
        questionsAsked: [], visitorJourney: [], memoryContext: [],
        preferredCategory: '', resumeViewed: false, contactViewed: false, hireIntent: false,
    }, memory, context);

    const interestsList = mem.portfolioInterests.length ? mem.portfolioInterests.join(', ') : 'not specified yet';
    const projectsList = mem.projectsViewed.length ? mem.projectsViewed.join(', ') : 'none viewed yet';
    const servicesList = mem.servicesViewed.length ? mem.servicesViewed.join(', ') : 'none viewed yet';

    return `You are PRATHEESH AI — the personal AI Portfolio Concierge for Pratheesh Clement (Digital Ecosystem 6.0). You act like ChatGPT with real-time continuous session memory.

IDENTITY: Pratheesh AI — Personal Digital Ecosystem Guide & Portfolio Concierge
PERSONALITY: Premium, intelligent, professional, friendly, confident, portfolio-focused

REAL-TIME VISITOR MEMORY:
- Visitor Persona: ${mem.visitorType || 'not selected'} | Intent: ${mem.intent || (mem.hireIntent ? 'HIGH HIRE INTENT' : 'exploring')}
- Hire Intent Active: ${mem.hireIntent ? 'YES' : 'No'} | Preferred Domain: ${mem.preferredCategory || 'General'}
- Identified Interests: ${interestsList}
- Projects Viewed: ${projectsList} | Services Viewed: ${servicesList}
- Resume Viewed: ${mem.resumeViewed ? 'YES' : 'No'} | Contact Section Visited: ${mem.contactViewed ? 'YES' : 'No'}
- Current Section: ${mem.currentSection || context.currentSection || 'home'} | Scroll Depth: ${mem.scrollDepth || context.scrollDepth || 0}%

GROUND TRUTH PROFILE:
- Location: Chennai, India | Available for freelance | Email: pratheesh.clement@gmail.com | Phone/WhatsApp: +91 8667876102
- LinkedIn: linkedin.com/in/mariya-pratheesh-5b8a9b316/ | GitHub: github.com/pratheeshclement-cmd
- Role: Freelance Digital Marketer, Website Developer, SEO Specialist
- Cert: Google Fundamentals of Digital Marketing (ID: 453421024, Verified)
- Projects: 1. Portfolio Redesign (Lighthouse 100/100) 2. SEO Growth Campaign 3. Restaurant Branding 4. B2B Meta Ads Funnel
- Services: Web Dev, Technical SEO, Google Ads, Meta Ads, Digital Marketing, Landing Pages, Website Optimization, AI Automation, Personal Branding

CHATGPT-LIKE MEMORY INSTRUCTIONS:
1. Reference previous user choices, viewed projects, visitor type, or interests naturally.
2. Provide tailored recommendations (Recruiter -> Skills/Resume; Client -> Services/Audit; Founder -> AI/Marketing; Developer -> Tech Stack/GitHub).
3. 2-4 sentences max per turn. Plain text only. Embed navigation commands like [SCROLL:projects] when appropriate.`;
}

function sanitize(str, max = 500) {
    return String(str || '').trim().slice(0, max).replace(/<[^>]*>/g, '');
}

async function handleAPIChat(req, res) {
    if (req.method === 'OPTIONS') {
        res.writeHead(204, CORS_HEADERS);
        return res.end();
    }
    if (req.method !== 'POST') {
        res.writeHead(405, CORS_HEADERS);
        return res.end(JSON.stringify({ error: 'Method not allowed' }));
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        res.writeHead(503, CORS_HEADERS);
        return res.end(JSON.stringify({ error: 'GEMINI_API_KEY not set in .env.local', fallback: true }));
    }

    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
        try {
            const data = JSON.parse(body);
            const message = sanitize(data.message);
            const context = data.context || {};
            const memory = data.memory || {};
            const history = (data.history || []).slice(-10).map(h => ({
                role: h.role === 'user' ? 'user' : 'model',
                parts: [{ text: sanitize(h.parts?.[0]?.text || '') }],
            }));

            if (!message) {
                res.writeHead(400, CORS_HEADERS);
                return res.end(JSON.stringify({ error: 'Message required' }));
            }

            const payload = {
                system_instruction: { parts: [{ text: buildSystemPrompt(context, memory) }] },
                contents: [...history, { role: 'user', parts: [{ text: message }] }],
                generationConfig: { temperature: 0.7, maxOutputTokens: 350, topK: 40, topP: 0.95 },
            };

            let lastErr = null;
            for (const model of GEMINI_MODELS) {
                try {
                    const endpoint = `${GEMINI_BASE}/${model}:generateContent`;
                    const geminiRes = await fetch(`${endpoint}?key=${apiKey}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                    });

                    if (geminiRes.status === 429) {
                        console.warn(`[AI] ${model} → 429 rate limited, trying next...`);
                        lastErr = `${model}: 429`;
                        continue;
                    }

                    if (!geminiRes.ok) {
                        const errText = await geminiRes.text();
                        console.error(`[AI] ${model} error:`, geminiRes.status, errText.slice(0, 150));
                        lastErr = `${model}: ${geminiRes.status}`;
                        continue;
                    }

                    const geminiData = await geminiRes.json();
                    const reply = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

                    if (!reply) { lastErr = `${model}: empty`; continue; }

                    console.log(`[AI] ✓ ${model} responded (${reply.length} chars)`);
                    res.writeHead(200, CORS_HEADERS);
                    return res.end(JSON.stringify({ reply, source: 'gemini', model }));

                } catch (fetchErr) {
                    lastErr = `${model}: ${fetchErr.message}`;
                    continue;
                }
            }

            // All models failed — fallback to local KB signal
            console.warn('[AI] All models rate-limited. Last error:', lastErr);
            res.writeHead(502, CORS_HEADERS);
            res.end(JSON.stringify({ error: 'Rate limited. Using local KB.', fallback: true }));

        } catch (err) {
            console.error('[AI] Handler error:', err.message);
            res.writeHead(500, CORS_HEADERS);
            res.end(JSON.stringify({ error: err.message, fallback: true }));
        }
    });
}

// Static file server
function serveStatic(req, res) {
    let filePath = path.join(PORTFOLIO_DIR, req.url === '/' ? 'index.html' : req.url);
    // Security: prevent directory traversal
    if (!filePath.startsWith(PORTFOLIO_DIR)) {
        res.writeHead(403); return res.end('Forbidden');
    }

    const ext = path.extname(filePath).toLowerCase();
    const mime = MIME[ext] || 'text/plain';

    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                res.writeHead(404); res.end('Not found');
            } else {
                res.writeHead(500); res.end('Server error');
            }
            return;
        }
        res.writeHead(200, { 'Content-Type': mime });
        res.end(data);
    });
}

// Create server
const server = http.createServer((req, res) => {
    const url = req.url.split('?')[0];
    console.log(`[${req.method}] ${url}`);

    if (url === '/api/chat') {
        handleAPIChat(req, res);
    } else {
        serveStatic(req, res);
    }
});

server.listen(PORT, () => {
    console.log('');
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║   PRATHEESH AI — Digital Ecosystem 5.0 — Local Server   ║');
    console.log('╠══════════════════════════════════════════════════════════╣');
    console.log(`║   🌐  Portfolio:  http://localhost:${PORT}                   ║`);
    console.log(`║   🤖  AI Chat:    http://localhost:${PORT}/api/chat           ║`);
    console.log(`║   🔑  API Key:    ${process.env.GEMINI_API_KEY ? '✅ Loaded from .env.local' : '❌ NOT FOUND'}         ║`);
    console.log('╠══════════════════════════════════════════════════════════╣');
    console.log('║   Open the URL in your browser to test the full system  ║');
    console.log('║   Press Ctrl+C to stop                                  ║');
    console.log('╚══════════════════════════════════════════════════════════╝');
    console.log('');
});
