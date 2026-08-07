import { apiClient } from '../core/apiClient';

export interface DashboardStats {
  totalVisitors: number;
  activeLeads: number;
  publishedBlogs: number;
  featuredProjects: number;
  serverHealth: string;
  seoScore: number;
  pageSpeedScore: number;
}

export const dashboardApi = {
  getStats: () => apiClient<{ stats: DashboardStats }>('/dashboard/stats'),
};
