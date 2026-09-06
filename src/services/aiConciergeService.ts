import { ChatApiResponse, UserRole } from '../types';

export interface AIQueryResult {
  success: boolean;
  answer: string;
  suggestedQuestions: string[];
  topic: string;
  source: 'api' | 'fallback';
  error?: string;
}

// Configurable API URL via environment variable. Defaults to local FastAPI in development.
const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_AI_API_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) {
    return envUrl.trim().replace(/\/+$/, '');
  }
  return import.meta.env.DEV ? 'http://localhost:8000' : '';
};

export const INITIAL_PERSONA_QUESTIONS: Record<UserRole, string[]> = {
  recruiter: [
    "What are Pratheesh's strongest skills?",
    "Tell me about his work experience",
    "What certifications does he hold?",
    "Is Pratheesh available for hire?",
  ],
  founder: [
    "How can Pratheesh help my business grow?",
    "What marketing & ad services does he offer?",
    "Can he automate workflows using AI?",
    "How do I start a project with him?",
  ],
  client: [
    "What services does Pratheesh provide?",
    "Can he optimize my website's SEO & speed?",
    "How do project pricing and timelines work?",
    "How can I contact Pratheesh?",
  ],
  developer: [
    "What is Pratheesh's tech stack?",
    "How was this portfolio engineered?",
    "Does he work with React, TypeScript & Three.js?",
    "Where can I see his GitHub projects?",
  ],
  browsing: [
    "Who is Pratheesh Clement?",
    "Show me his featured projects",
    "What digital services does he offer?",
    "How do I get in touch?",
  ],
};

/**
 * Sends conversation payload to Python FastAPI service.
 * If external service is unavailable, returns a graceful offline response without silently faking it.
 */
export async function queryConversationalAI(
  persona: UserRole,
  messages: { role: 'user' | 'assistant'; content: string }[]
): Promise<AIQueryResult> {
  const baseUrl = getApiBaseUrl();

  if (!baseUrl) {
    return {
      success: false,
      source: 'fallback',
      topic: 'offline',
      answer: "I'm having trouble connecting to my conversation service right now. You can still explore the portfolio or contact Pratheesh directly at pratheesh.clement@gmail.com.",
      suggestedQuestions: [
        "What are Pratheesh's strongest skills?",
        "What services does he provide?",
        "How can I contact Pratheesh?",
      ],
      error: 'No AI service endpoint configured.',
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        persona,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`API returned HTTP ${res.status}`);
    }

    const data: ChatApiResponse = await res.json();

    return {
      success: true,
      source: 'api',
      answer: data.answer,
      suggestedQuestions: Array.isArray(data.suggestedQuestions) ? data.suggestedQuestions : [],
      topic: data.topic || 'general',
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const errorMessage = err instanceof Error ? err.message : 'Connection failed';

    return {
      success: false,
      source: 'fallback',
      topic: 'offline',
      answer: "I'm having trouble connecting to my conversation service right now. You can still explore the portfolio or contact Pratheesh directly at pratheesh.clement@gmail.com.",
      suggestedQuestions: [
        "What are Pratheesh's strongest skills?",
        "What services does he provide?",
        "How can I contact Pratheesh?",
      ],
      error: errorMessage,
    };
  }
}
