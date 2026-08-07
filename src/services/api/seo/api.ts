import { apiClient } from '../core/apiClient';

export const seoApi = {
  getQueries: () => apiClient<any[]>('/seo/queries'),
  getPageSpeed: (url?: string) => apiClient<Record<string, number>>(`/seo/pagespeed?url=${encodeURIComponent(url || '')}`),
};
