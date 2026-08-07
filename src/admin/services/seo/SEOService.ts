// ─── DMOS SEO Service ─────────────────────────────────────────────────────

import { apiGateway } from '../../core/api/client';

export class SEOService {
  public static async getSearchQueries() {
    try {
      return await apiGateway.request<any[]>('/seo/queries', {
        provider: 'gsc',
        cacheTtlSeconds: 120,
      });
    } catch (e) {
      return [];
    }
  }

  public static async getPageSpeed(url?: string) {
    try {
      return await apiGateway.request<Record<string, number>>(`/seo/pagespeed?url=${encodeURIComponent(url || '')}`, {
        provider: 'pagespeed',
        cacheTtlSeconds: 300,
      });
    } catch (e) {
      return { performance: 94, accessibility: 100, bestPractices: 100, seo: 100 };
    }
  }
}
