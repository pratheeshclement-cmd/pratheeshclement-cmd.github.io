import { apiClient } from '../core/apiClient';

export interface SystemMetricsResponse {
  status: string;
  cpuCount: number;
  cpuModel: string;
  cpuUsagePercent: number;
  memoryTotalMB: number;
  memoryUsedMB: number;
  memoryUsagePercent: number;
  serverUptimeSeconds: number;
  platform: string;
  arch: string;
  nodeVersion: string;
  gatewayLatencyMs: number;
  firebaseStatus: string;
  githubApiStatus: string;
}

export const systemApi = {
  getMetrics: () => apiClient<SystemMetricsResponse>('/system/metrics'),
  getHealth: () => apiClient<{ status: string; gateway: string }>('/health'),
};
