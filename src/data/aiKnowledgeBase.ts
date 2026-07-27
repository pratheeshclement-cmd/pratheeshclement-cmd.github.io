// AI Concierge knowledge base & intelligent reasoning engine
// All facts sourced from docs/CONTENT.md — strictly canonical facts

export interface KnowledgeDomain {
  id: string;
  intents: string[];
  response: string;
}

export const DOMAINS: KnowledgeDomain[] = [
  {
    id: 'bio_identity',
    intents: ['who', 'pratheesh', 'about', 'yourself', 'introduction', 'intro', 'name', 'tagline', 'motto', 'story'],
    response:
      'Pratheesh Clement (Mariya Pratheesh) is a Digital Marketing Specialist & AI Enthusiast based in Vadalur, Tamil Nadu, India. Positioning himself as an "Architect of Digital Ecosystems", he combines frontend development (React/TS), UI/UX design, technical SEO, and paid ad funnels with AI-driven workflows. His motto is: "Sacrifice is the brilliant move."',
  },
  {
    id: 'why_hire',
    intents: ['why', 'hire', 'value', 'benefit', 'unique', 'choose', 'differ', 'advantage'],
    response:
      'Why hire Pratheesh? Unlike traditional marketers or developers who work in isolation, Pratheesh bridges the gap between technology and strategy. He builds conversion-focused web apps, optimizes technical search architectures, runs high-ROI Google & Meta ad campaigns, and automates marketing workflows with AI — delivering end-to-end digital growth.',
  },
  {
    id: 'skills_tech',
    intents: ['skill', 'stack', 'technology', 'technologies', 'tools', 'know', 'expertise', 'react', 'typescript', 'next', 'code', 'programming'],
    response:
      'Pratheesh is Expert in Technical SEO (Schema markup, Core Web Vitals, GA4), Paid Ads (Google Search Ads, Meta Ads), and Digital Strategy. He is Proficient in Web Development (React, Next.js, TypeScript, HTML5, CSS Grid), AI Tools (OpenAI, Gemini, Claude, Zapier), and UI/UX (Figma, Photoshop).',
  },
  {
    id: 'experience_career',
    intents: ['experience', 'work', 'job', 'career', 'history', 'background', 'jbhl', 'nexteer'],
    response:
      'Pratheesh is currently Digital Marketer at JBHL Pvt Ltd, leading digital campaigns, SEO, and paid ad strategies. Previously, he served as a Store/Production Associate at Nexteer Automotive India Pvt Ltd in Chennai — a global automotive steering systems manufacturer — where he mastered inventory layouts, parts logistics, and operational discipline.',
  },
  {
    id: 'projects_portfolio',
    intents: ['project', 'portfolio', 'case study', 'work done', 'built', 'ecommerce', 'restaurant', 'b2b'],
    response:
      'Featured case studies:\n1. SEO Growth Campaign: Technical audit, JSON-LD schema, and sitemap rebuild for an Indian e-commerce platform.\n2. Restaurant Branding Web Layout: Custom responsive CSS Grid menus with touch micro-interactions.\n3. B2B Social Lead Funnel: Meta Ads with custom pixel event tracking & lookalikes.\n4. Portfolio X: This scroll-driven cinematic digital universe built with React, GSAP, and Three.js.',
  },
  {
    id: 'services_offerings',
    intents: ['service', 'offer', 'help', 'freelance', 'available', 'availability', 'website', 'seo', 'ads', 'landing'],
    response:
      'Pratheesh offers 9 key services:\n1. Website Development (React/Next.js)\n2. Technical SEO & Core Web Vitals\n3. Google Search & Display Ads\n4. Meta Ads & Custom Pixel Tracking\n5. Digital Marketing Strategy\n6. High-Converting Landing Pages\n7. Performance & Speed Audits\n8. AI Workflow Automation\n9. Personal Branding & UI/UX Design',
  },
  {
    id: 'certifications_education',
    intents: ['certification', 'certificate', 'google', 'skillshop', 'qualified', 'credential', 'education', 'degree', 'bca'],
    response:
      'Pratheesh holds a Bachelor of Computer Applications (BCA) degree. He is also Google Skillshop certified in "Fundamentals of Digital Marketing" (Completion ID: 453421024), accredited by IAB Europe and The Open University.',
  },
  {
    id: 'contact_details',
    intents: ['contact', 'email', 'phone', 'reach', 'message', 'whatsapp', 'connect', 'touch'],
    response:
      'You can reach Pratheesh directly:\n• Email: pratheesh.clement@gmail.com\n• Phone / WhatsApp: +91 8667876102\n• Location: Vadalur, Tamil Nadu, India (IST timezone)\n• Response time: Within 24 hours',
  },
  {
    id: 'ai_automation',
    intents: ['ai', 'artificial intelligence', 'automation', 'chatgpt', 'openai', 'gemini', 'claude', 'bot', 'workflow'],
    response:
      'Pratheesh specializes in AI-assisted workflows using OpenAI, Gemini, and Claude APIs. He designs prompt engineering systems, automated reporting pipelines, Zapier webhooks, and AI concierge agents to streamline operations.',
  },
  {
    id: 'pricing_rates',
    intents: ['price', 'cost', 'rate', 'quote', 'budget', 'charge', 'fee'],
    response:
      'Pricing varies depending on project scope, technical complexity, and timeline. Contact Pratheesh at pratheesh.clement@gmail.com or WhatsApp +91 8667876102 with your requirements for a customized proposal.',
  },
  {
    id: 'location_remote',
    intents: ['location', 'where', 'india', 'remote', 'timezone', 'vadalur', 'chennai', 'country'],
    response:
      'Pratheesh is based in Vadalur, Tamil Nadu, India (IST / UTC+5:30). He works fully remote and collaborates with companies and founders globally.',
  },
];

export const ROLE_QUICK_CHIPS: Record<string, string[]> = {
  recruiter: [
    'Tell me about his skills',
    'What is his experience?',
    'View his Google certification',
    'Why hire Pratheesh?',
  ],
  founder: [
    'What services does he offer?',
    'How can he grow my business?',
    'AI automation for my startup?',
    'How do I contact him?',
  ],
  client: [
    'What services are available?',
    'Can he optimize my website SEO?',
    'How much does it cost?',
    'How to start a project?',
  ],
  developer: [
    'What is his tech stack?',
    'How was this portfolio built?',
    'AI tools he works with?',
    'View his GitHub profile',
  ],
  browsing: [
    'Who is Pratheesh Clement?',
    'Show me his case studies',
    'What is his background?',
    'How do I contact him?',
  ],
};

/**
 * Intelligent Semantic Intent Reasoning Engine:
 * Analyzes query intent across weighted domain concepts and generates natural responses.
 */
export function getAIResponse(input: string): string {
  const query = input.toLowerCase().trim();
  const words = query.split(/\W+/).filter(w => w.length > 2);

  let bestDomain: KnowledgeDomain | null = null;
  let maxScore = 0;

  for (const domain of DOMAINS) {
    let score = 0;
    for (const intent of domain.intents) {
      if (query.includes(intent)) {
        score += intent.length * 2;
      }
      for (const word of words) {
        if (intent.includes(word) || word.includes(intent)) {
          score += 3;
        }
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestDomain = domain;
    }
  }

  if (bestDomain && maxScore >= 4) {
    return bestDomain.response;
  }

  return "I am Pratheesh Clement's Portfolio AI. Ask me about his digital marketing services, technical SEO, web development stack, Nexteer/JBHL experience, Google certifications, or case studies! You can also email him directly at pratheesh.clement@gmail.com.";
}

/**
 * Unified Response API Hook:
 * Checks for configured Gemini API endpoint, falling back to local intent reasoning engine.
 */
export async function queryAIConcierge(input: string, history: { role: string; content: string }[] = []): Promise<string> {
  const geminiEndpoint = import.meta.env.VITE_GEMINI_API_ENDPOINT;

  if (geminiEndpoint) {
    try {
      const res = await fetch(geminiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input, history }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.reply) return data.reply;
      }
    } catch {
      // Graceful fallback to local semantic reasoning engine
    }
  }

  return getAIResponse(input);
}
