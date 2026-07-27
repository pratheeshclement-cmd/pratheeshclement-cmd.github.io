// AI Concierge knowledge base — keyword-to-response map
// All responses sourced from docs/CONTENT.md — no invented content

export interface KnowledgeEntry {
  keywords: string[];
  response: string;
}

export const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  {
    keywords: ['who', 'pratheesh', 'about', 'yourself', 'introduction', 'intro'],
    response:
      'Pratheesh Clement is a multidisciplinary digital professional specializing in Digital Marketing, UI/UX Design, SEO, Web Development, Branding, and AI-powered solutions. He is based in Vadalur, Tamil Nadu, India.',
  },
  {
    keywords: ['skill', 'stack', 'technology', 'technologies', 'tools', 'know', 'expertise'],
    response:
      'Pratheesh is Expert in Technical SEO (Schema, GA4, Core Web Vitals), Paid Advertising (Google Ads, Meta Ads), and Digital Marketing. Proficient in Web Development (React, Next.js, TypeScript), AI & Automation (OpenAI, Gemini, Claude), and UI/UX Design (Figma, Photoshop).',
  },
  {
    keywords: ['experience', 'work', 'job', 'career', 'history', 'background'],
    response:
      'Pratheesh currently works as a Digital Marketer at JBHL Pvt Ltd. Previously he was a Store/Production Associate at Nexteer Automotive India Pvt Ltd in Chennai — a global steering systems manufacturer — where he developed rigorous operational discipline.',
  },
  {
    keywords: ['project', 'portfolio', 'case study', 'work done', 'built'],
    response:
      'Featured case studies include: 1) SEO Growth Campaign — rebuilt technical SEO architecture for an Indian e-commerce platform resulting in significant organic visibility gain. 2) Restaurant Branding Web Layout — responsive CSS Grid frontend. 3) Social Media B2B Conversion Funnel — Meta Ads with custom pixel events and lookalike audiences. 4) This Portfolio — scroll-driven cinematic experience built with React, GSAP, and Three.js.',
  },
  {
    keywords: ['service', 'offer', 'help', 'hire', 'freelance', 'available', 'availability'],
    response:
      'Services include: Website Development, Technical SEO, Google Ads, Meta Ads, Digital Marketing Strategy, Landing Page Development, Performance Optimization, AI Automation, and Personal Branding. Pratheesh is open to freelance and remote work.',
  },
  {
    keywords: ['contact', 'email', 'phone', 'reach', 'message', 'whatsapp', 'connect'],
    response:
      'You can contact Pratheesh via Email: pratheesh.clement@gmail.com or Phone/WhatsApp: +91 8667876102. He is based in Vadalur, Tamil Nadu, India (IST). He typically responds within 24 hours.',
  },
  {
    keywords: ['certification', 'certificate', 'google', 'skillshop', 'qualified', 'credential'],
    response:
      'Pratheesh holds the Google Skillshop Fundamentals of Digital Marketing certification (Completion ID: 453421024), verified by IAB Europe and The Open University. He also holds a Bachelor of Computer Applications (BCA) degree.',
  },
  {
    keywords: ['education', 'degree', 'bca', 'study', 'university', 'college'],
    response:
      'Pratheesh holds a Bachelor of Computer Applications (BCA) degree, covering software engineering, database architecture, algorithms, and web programming. He is also Google Skillshop certified (ID: 453421024).',
  },
  {
    keywords: ['seo', 'search engine', 'optimization', 'ranking', 'organic'],
    response:
      'Pratheesh is an Expert-level Technical SEO specialist. He handles schema markup, SEO audits, keyword research, XML sitemaps, Core Web Vitals, GA4 Analytics, and full-funnel organic growth strategies.',
  },
  {
    keywords: ['ai', 'artificial intelligence', 'automation', 'chatgpt', 'openai', 'gemini'],
    response:
      'Pratheesh actively works with AI tools including OpenAI API, Gemini, and Claude. He designs AI workflows, prompt engineering systems, auto-reporting pipelines, and AI chat agent integrations using Zapier and API webhooks.',
  },
  {
    keywords: ['design', 'ui', 'ux', 'figma', 'interface', 'visual', 'brand'],
    response:
      'Pratheesh is proficient in UI/UX Design using Figma, Photoshop, Illustrator, After Effects, and Premiere Pro. His design work emphasizes glassmorphism, micro-interactions, typography systems, and user-centered thinking.',
  },
  {
    keywords: ['location', 'where', 'india', 'remote', 'timezone', 'based'],
    response:
      'Pratheesh is based in Vadalur, Tamil Nadu, India (IST — UTC+5:30). He works fully remote and is open to international collaboration.',
  },
  {
    keywords: ['price', 'cost', 'rate', 'quote', 'budget', 'charge'],
    response:
      'Project pricing depends on scope, complexity, and timeline. For a custom quote, reach out at pratheesh.clement@gmail.com or WhatsApp +91 8667876102 with your project details.',
  },
  {
    keywords: ['social', 'linkedin', 'github', 'instagram', 'follow'],
    response:
      'Connect with Pratheesh on LinkedIn (mariya-pratheesh-5b8a9b316), GitHub (pratheeshclement-cmd), or Instagram (pratheeeesh). Portfolio: pratheeshclement-cmd.github.io',
  },
];

export const ROLE_QUICK_CHIPS: Record<string, string[]> = {
  recruiter: [
    'Tell me about his skills',
    'What is his experience?',
    'Is he open to work?',
    'View his certifications',
  ],
  founder: [
    'What services does he offer?',
    'How can he help my startup?',
    'AI automation for my business?',
    'How do I contact him?',
  ],
  client: [
    'What services are available?',
    'How much does it cost?',
    'Can he redesign my website?',
    'How do I get started?',
  ],
  developer: [
    'What is his tech stack?',
    'How was this portfolio built?',
    'AI workflow tools he uses?',
    'View his GitHub',
  ],
  browsing: [
    'Tell me about Pratheesh',
    'Show me his projects',
    'What does he do?',
    'How to contact him?',
  ],
};

export function getAIResponse(input: string): string {
  const q = input.toLowerCase().trim();
  let bestMatch: KnowledgeEntry | null = null;
  let highestScore = 0;

  for (const entry of KNOWLEDGE_BASE) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (q.includes(kw)) {
        score += kw.length; // Weight longer keyword matches higher
      }
    }
    if (score > highestScore) {
      highestScore = score;
      bestMatch = entry;
    }
  }

  if (bestMatch && highestScore > 0) {
    return bestMatch.response;
  }

  return "I am Pratheesh Clement's Portfolio AI. Ask me about his skills, experience, projects, services, or certifications. You can also reach him directly at pratheesh.clement@gmail.com.";
}

/**
 * Unified response provider:
 * Uses rule-based logic by default. Designed to plug into Gemini API when endpoint is configured.
 */
export async function queryAIConcierge(input: string, _history: { role: string; content: string }[] = []): Promise<string> {
  const geminiEndpoint = import.meta.env.VITE_GEMINI_API_ENDPOINT;

  if (geminiEndpoint) {
    try {
      const res = await fetch(geminiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input, history: _history }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.reply) return data.reply;
      }
    } catch {
      // Fallback to rule-based logic if API fails
    }
  }

  return getAIResponse(input);
}
