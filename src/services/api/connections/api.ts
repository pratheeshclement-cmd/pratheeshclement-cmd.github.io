import { apiClient } from '../core/apiClient';

export interface HealthProvider {
  id: string;
  name: string;
  status: string;
  latencyMs: number;
}

export const connectionsApi = {
  getHealth: () => apiClient<{ providers: HealthProvider[] }>('/connections/health'),
};
