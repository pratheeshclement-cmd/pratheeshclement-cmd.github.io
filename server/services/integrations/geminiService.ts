// ─── Integration Service: Google Gemini AI API ────────────────────────────────
// Interfacing with official Google Gemini REST API v1beta: https://generativelanguage.googleapis.com/v1beta
// Server-side API key authentication & content generation gateway.

import axios from 'axios';
import { ProviderHealthResult } from './integrationTypes';

const API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

export interface GeminiGenerationResult {
  success: boolean;
  reply?: string;
  error?: string;
  model?: string;
  usage?: any;
}

export class GeminiIntegrationService {
  private static getCredentials() {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    const model = process.env.GEMINI_MODEL?.trim() || 'gemini-1.5-flash';
    const hasCreds = Boolean(apiKey && apiKey.length > 0);
    return { apiKey, model, hasCreds };
  }

  private static sanitizeErrorMessage(err: any): string {
    const rawMsg = err.response?.data?.error?.message || err.message || 'Gemini API execution error';
    const { apiKey } = this.getCredentials();
    let sanitized = rawMsg;
    if (apiKey && apiKey.length > 5) {
      sanitized = sanitized.replace(new RegExp(apiKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '[REDACTED]');
    }
    return sanitized.replace(/key=[A-Za-z0-9_-]+/g, 'key=[REDACTED]');
  }

  public static async verify(): Promise<ProviderHealthResult> {
    const { apiKey, model, hasCreds } = this.getCredentials();
    const start = Date.now();

    if (!hasCreds) {
      return {
        id: 'gemini',
        name: 'Google Gemini AI API',
        category: 'AI',
        status: 'auth_required',
        latencyMs: 0,
        lastCheckedAt: new Date().toISOString(),
        apiVersion: 'v1beta',
        docsUrl: 'https://ai.google.dev/docs',
        message: 'Authentication Required. Configure GEMINI_API_KEY in server/.env.',
        configured: false,
      };
    }

    try {
      await axios.get(`${API_BASE}/models?key=${apiKey}`, { timeout: 8000 });
      const latencyMs = Math.max(1, Date.now() - start);

      return {
        id: 'gemini',
        name: 'Google Gemini AI API',
        category: 'AI',
        status: 'connected',
        latencyMs,
        lastCheckedAt: new Date().toISOString(),
        apiVersion: 'v1beta',
        docsUrl: 'https://ai.google.dev/docs',
        message: `Google Gemini API active (${model} ready).`,
        configured: true,
      };
    } catch (err: any) {
      const latencyMs = Math.max(1, Date.now() - start);
      const httpStatus = err.response?.status;
      let status: ProviderHealthResult['status'] = 'auth_required';

      if (httpStatus === 401 || httpStatus === 403) {
        status = 'authentication_failed' as any;
      } else if (httpStatus === 429) {
        status = 'quota_exceeded' as any;
      } else if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        status = 'timeout';
      } else if (httpStatus >= 500 || err.code === 'ENOTFOUND') {
        status = 'unavailable';
      }

      return {
        id: 'gemini',
        name: 'Google Gemini AI API',
        category: 'AI',
        status,
        latencyMs,
        lastCheckedAt: new Date().toISOString(),
        apiVersion: 'v1beta',
        docsUrl: 'https://ai.google.dev/docs',
        message: `Gemini API Verification: ${this.sanitizeErrorMessage(err)}`,
        configured: true,
      };
    }

  }

  public static async generateContent(prompt: string, systemInstruction?: string): Promise<GeminiGenerationResult> {
    const { apiKey, model, hasCreds } = this.getCredentials();
    if (!hasCreds) {
      return { success: false, error: 'GEMINI_API_KEY is missing in server/.env file.' };
    }

    if (prompt && prompt.length > 4000) {
      return { success: false, error: 'Prompt length exceeds maximum allowed limit of 4000 characters.' };
    }

    try {
      const payload: any = {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      };

      if (systemInstruction) {
        payload.systemInstruction = {
          parts: [{ text: systemInstruction }],
        };
      }

      const res = await axios.post(
        `${API_BASE}/models/${model}:generateContent?key=${apiKey}`,
        payload,
        { headers: { 'Content-Type': 'application/json' }, timeout: 15000 }
      );

      const candidate = res.data.candidates?.[0];
      const text = candidate?.content?.parts?.[0]?.text;

      if (!text) {
        return { success: false, error: 'No response content returned by Gemini model.', model };
      }

      return {
        success: true,
        reply: text,
        model,
        usage: res.data.usageMetadata,
      };
    } catch (err: any) {
      return {
        success: false,
        error: this.sanitizeErrorMessage(err),
        model,
      };
    }
  }


  public static async getHealthDetails(): Promise<{ configured: boolean; model: string; status: string; message: string }> {
    const { model, hasCreds } = this.getCredentials();
    const verifyRes = await this.verify();

    return {
      configured: hasCreds,
      model,
      status: verifyRes.status,
      message: verifyRes.message,
    };
  }
}
