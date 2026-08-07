// ─── DMOS Backend: Gemini AI Router ───────────────────────────────────────

import { Router } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const aiRouter = Router();

const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// POST /api/ai/generate-blog
aiRouter.post('/generate-blog', async (req, res) => {
  try {
    const { topic, keywords, targetAudience } = req.body;

    if (!genAI) {
      return res.json({
        title: `Complete Guide to ${topic || 'Technical SEO'}`,
        content: `## Introduction\nIn this comprehensive guide on **${topic || 'Technical SEO'}**, we explore key performance indicators, Core Web Vitals optimization, and practical implementations.`,
        metaDescription: `Master ${topic || 'Technical SEO'} with practical strategies, Core Web Vitals optimizations, and real-world examples.`,
        faq: [
          { question: `What is ${topic}?`, answer: `${topic} involves optimizing technical infrastructure for search engine visibility.` },
        ],
      });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `Write a high-converting, technical blog post about "${topic}". Keywords: ${keywords || 'SEO, React, Performance'}. Target Audience: ${targetAudience || 'Developers & Marketers'}. Output structured Markdown with headers.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.json({
      title: `Guide to ${topic}`,
      content: text,
      metaDescription: text.slice(0, 155).replace(/[#*]/g, ''),
      faq: [
        { question: `How does ${topic} improve performance?`, answer: `Optimizing ${topic} directly improves page speed and user retention.` },
      ],
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/ai/seo-metadata
aiRouter.post('/seo-metadata', async (req, res) => {
  try {
    const { title, content } = req.body;

    res.json({
      seoTitle: `${title} | Pratheesh Clement Portfolio`,
      metaDescription: `Learn about ${title}. Expert insights on digital marketing, UI/UX design, and AI workflows.`,
      canonicalUrl: `https://pratheeshclement-cmd.github.io/blog/${(title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}/`,
      faqSchema: [
        { '@type': 'Question', name: `What are the key takeaways of ${title}?`, acceptedAnswer: { '@type': 'Answer', text: `This article covers actionable strategies for ${title}.` } },
      ],
      articleSchema: {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: title,
        author: { '@type': 'Person', name: 'Pratheesh Clement' },
      },
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/ai/social-captions
aiRouter.post('/social-captions', async (req, res) => {
  try {
    const { topic } = req.body;
    res.json({
      linkedin: `🚀 Excited to share my latest article on ${topic}!\n\nCheck out the full breakdown and code snippets. #DigitalMarketing #SEO #WebDev`,
      twitter: `1/5 Just published a new guide on ${topic}! Here's what you need to know 🧵👇`,
      instagram: `Transform your digital workflow with ${topic}! 📈 Swipe left for key takeaways. #UIUX #Developer #Marketing`,
      newsletter: `Hey team! In this week's issue, we break down ${topic} step-by-step.`,
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});
