// ─── DMOS Domain Services ──────────────────────────────────────────────────

import { apiGateway } from '../core/api/client';

export class BlogService {
  public static async listBlogs() {
    return await apiGateway.request<any[]>('/blog', { provider: 'blog', cacheTtlSeconds: 30 });
  }

  public static async executeAutomatedPublishing(data: { title: string; content: string; category?: string; tags?: string[] }) {
    return await apiGateway.request<any>('/blog/publish-pipeline', {
      method: 'POST',
      body: data,
      provider: 'blog',
    });
  }

  public static async deleteBlog(id: string) {
    return await apiGateway.request<any>(`/blog/${id}`, {
      method: 'DELETE',
      provider: 'blog',
    });
  }
}

export class CRMService {
  public static async listLeads() {
    return await apiGateway.request<any[]>('/crm/leads', { provider: 'crm', cacheTtlSeconds: 30 });
  }

  public static async submitContactForm(data: { name: string; email: string; phone?: string; company?: string; service?: string; message: string; estimatedValue?: number }) {
    return await apiGateway.request<any>('/crm/contact-submit', {
      method: 'POST',
      body: data,
      provider: 'crm',
    });
  }
}

export class AIService {
  public static async generateBlog(data: { topic: string; keywords?: string; targetAudience?: string }) {
    return await apiGateway.request<any>('/ai/generate-blog', {
      method: 'POST',
      body: data,
      provider: 'gemini',
    });
  }

  public static async generateSeoMetadata(data: { title: string; content: string }) {
    return await apiGateway.request<any>('/ai/seo-metadata', {
      method: 'POST',
      body: data,
      provider: 'gemini',
    });
  }

  public static async generateSocialCaptions(topic: string) {
    return await apiGateway.request<any>('/ai/social-captions', {
      method: 'POST',
      body: { topic },
      provider: 'gemini',
    });
  }
}

export class GitHubService {
  public static async getRepoStats() {
    return await apiGateway.request<any>('/github/repo-stats', { provider: 'github', cacheTtlSeconds: 120 });
  }
}

export class CloudflareService {
  public static async getStats() {
    return await apiGateway.request<any>('/cloudflare/stats', { provider: 'cloudflare', cacheTtlSeconds: 120 });
  }
}

export class AutomationEngineService {
  public static async triggerWorkflow(recipeId: string, payload?: any) {
    return await apiGateway.request<any>('/automation/trigger', {
      method: 'POST',
      body: { recipeId, payload },
      provider: 'automation',
    });
  }
}
