import { apiClient } from '../core/apiClient';

export const reportsApi = {
  generateReport: (type: string, format: string) => apiClient<{ url?: string; data?: any }>('/reports/generate', {
    method: 'POST',
    body: JSON.stringify({ type, format }),
  }),
};
