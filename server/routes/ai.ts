// ─── DMOS Backend: Gemini AI Router (Production Integration) ───────────────────
// Authenticated administrative endpoints secured with requireAdminAuth & Public AI endpoints.

import { Router, Request, Response } from 'express';
import { requireAdminAuth } from '../middleware/auth';
import { createRateLimiter } from '../middleware/rateLimiter';
import { GeminiIntegrationService } from '../services/integrations/geminiService';

export const aiRouter = Router();

// Protected Admin Endpoints
aiRouter.get('/status', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const status = await GeminiIntegrationService.verify();
    res.json(status);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

aiRouter.get('/health', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const details = await GeminiIntegrationService.getHealthDetails();
    res.json({ success: true, details });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

aiRouter.post('/verify', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const status = await GeminiIntegrationService.verify();
    res.json(status);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

aiRouter.post('/generate', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const { prompt, systemInstruction } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Prompt string is required.' });
    }
    const result = await GeminiIntegrationService.generateContent(prompt, systemInstruction);
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// Protected AI Marketing Analyst Foundation Endpoint
aiRouter.post('/analyze-marketing', requireAdminAuth as any, async (req: Request, res: Response) => {
  try {
    const { analyticsData, gscData } = req.body;
    const systemInstruction = `You are the Pratheesh OS AI Marketing & SEO Analyst. Your job is to analyze real marketing telemetry (GA4, GSC, CRM) and provide structured analysis.
Strict Output Formatting Guidelines:
For every insight categorized under [TRAFFIC], [SEO], [CONTENT], [PERFORMANCE], or [OPPORTUNITIES], output EXACTLY three lines:
FACT: <empirical metric statement directly from provided data>
OBSERVATION: <analytical observation explaining pattern>
RECOMMENDATION: <non-causative action item using neutral terminology like "Potential improvement" or "Requires review">
Never invent numbers. Only evaluate provided telemetry.`;

    const prompt = `Analyze this real marketing telemetry:
GA4 Telemetry: ${JSON.stringify(analyticsData || {})}
Search Console Telemetry: ${JSON.stringify(gscData || {})}
Generate structured analysis across TRAFFIC, SEO, and OPPORTUNITIES using the required FACT, OBSERVATION, RECOMMENDATION format.`;

    const result = await GeminiIntegrationService.generateContent(prompt, systemInstruction);
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});


// Public AI Concierge Proxy Endpoint (Zero client-side secrets)
aiRouter.post('/concierge', async (req: Request, res: Response) => {
  try {
    const { prompt, history } = req.body;
    const userPrompt = prompt || req.body.input || 'Hello';
    const systemInstruction = "You are Pratheesh Clement's AI Portfolio Concierge. Provide helpful, professional answers regarding Pratheesh's skills in Digital Marketing, Technical SEO, React/Vite development, Google Ads, Meta Ads, and AI Automation.";

    const result = await GeminiIntegrationService.generateContent(userPrompt, systemInstruction);
    if (result.success && result.reply) {
      res.json({ reply: result.reply, model: result.model });
    } else {
      res.json({ reply: "I am Pratheesh Clement's Portfolio AI Concierge. Ask me about his digital marketing campaigns, technical SEO, web development stack, or certifications!" });
    }
  } catch (e: any) {
    res.json({ reply: "I am Pratheesh Clement's Portfolio AI Concierge. Feel free to contact Pratheesh directly at pratheesh.clement@gmail.com!" });
  }
});

// POST /api/ai/generate-blog
aiRouter.post('/generate-blog', async (req: Request, res: Response) => {
  try {
    const { topic, keywords, targetAudience } = req.body;
    const prompt = `Write a high-converting, technical blog post about "${topic || 'Technical SEO'}". Keywords: ${keywords || 'SEO, React, Performance'}. Target Audience: ${targetAudience || 'Developers & Marketers'}. Output structured Markdown with headers.`;

    const result = await GeminiIntegrationService.generateContent(prompt);
    if (result.success && result.reply) {
      res.json({
        title: `Guide to ${topic || 'Technical SEO'}`,
        content: result.reply,
        metaDescription: result.reply.slice(0, 155).replace(/[#*]/g, ''),
        faq: [
          { question: `How does ${topic} improve performance?`, answer: `Optimizing ${topic} directly improves page speed and user retention.` },
        ],
      });
    } else {
      res.json({
        title: `Complete Guide to ${topic || 'Technical SEO'}`,
        content: `## Introduction\nIn this comprehensive guide on **${topic || 'Technical SEO'}**, we explore key performance indicators, Core Web Vitals optimization, and practical implementations.`,
        metaDescription: `Master ${topic || 'Technical SEO'} with practical strategies, Core Web Vitals optimizations, and real-world examples.`,
        faq: [
          { question: `What is ${topic}?`, answer: `${topic} involves optimizing technical infrastructure for search engine visibility.` },
        ],
      });
    }
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});
