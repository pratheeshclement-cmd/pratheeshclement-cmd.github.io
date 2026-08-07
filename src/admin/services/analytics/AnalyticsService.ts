// ─── DMOS Analytics Service ───────────────────────────────────────────────

import { apiGateway } from '../../core/api/client';

export class AnalyticsService {
  public static async getKPIs() {
    try {
      return await apiGateway.request<Record<string, any>>('/analytics/kpis', {
        provider: 'ga4',
        cacheTtlSeconds: 60,
      });
    } catch (e) {
      console.warn('Backend analytics endpoint offline, returning cache state');
      return null;
    }
  }

  public static async getRealtimeVisitors() {
    try {
      return await apiGateway.request<any[]>('/analytics/realtime', {
        provider: 'ga4',
        cacheTtlSeconds: 15,
      });
    } catch (e) {
      return [];
    }
  }
}
