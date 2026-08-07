import { apiClient } from '../core/apiClient';

export const analyticsApi = {
  getKPIs: () => apiClient<Record<string, any>>('/analytics/kpis'),
  getRealtime: () => apiClient<any[]>('/analytics/realtime'),
};
