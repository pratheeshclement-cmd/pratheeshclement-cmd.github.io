import { apiClient } from '../core/apiClient';

export interface DashboardMetric {
  value: number | string | null;
  previousValue?: number | string | null;
  change?: number | null;
  changePercent?: number | null;
  source: string;
  fetchedAt: string | null;
  status: 'live' | 'stale' | 'unavailable' | 'error' | 'not_configured' | 'auth_required';
  error?: string;
}

export interface DashboardHealthItem {
  id: string;
  label: string;
  status: 'healthy' | 'warning' | 'error' | 'auth_required' | 'not_configured';
  latencyMs: number;
  message: string;
  lastCheckedAt: string;
}

export interface DashboardResponse {
  fetchedAt: string;
  overview: {
    blogPosts: DashboardMetric;
    projects: DashboardMetric;
    crmLeads: DashboardMetric;
    pipelineValue: DashboardMetric;
  };
  analytics: {
    visitorsToday: DashboardMetric;
    activeUsers: DashboardMetric;
    pageViews: DashboardMetric;
    avgDuration: DashboardMetric;
    gscClicks?: DashboardMetric;
    gscImpressions?: DashboardMetric;
  };
  health: {
    services: DashboardHealthItem[];
    overallStatus: 'healthy' | 'degraded' | 'error';
  };
  connections: Array<{
    id: string;
    name: string;
    status: string;
    latencyMs: number;
    lastCheckedAt: string;
    message?: string;
  }>;
  activity: Array<{
    id: string;
    title: string;
    description: string;
    timestamp: string;
    type: 'info' | 'success' | 'warning' | 'error';
  }>;
  errors: string[];
}

export interface DashboardStats {
  totalVisitors: number | string | null;
  activeLeads: number | null;
  publishedBlogs: number | null;
  featuredProjects: number | null;
  serverHealth: string;
}

export interface GetDashboardResponse {
  success: boolean;
  data: DashboardResponse;
  stats: DashboardStats;
  timestamp: string;
}

export const dashboardApi = {
  getStats: () => apiClient<GetDashboardResponse>('/admin/dashboard'),
  getDashboardData: () => apiClient<GetDashboardResponse>('/admin/dashboard'),
};

