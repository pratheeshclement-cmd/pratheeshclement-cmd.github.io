import { apiClient } from '../core/apiClient';

export interface WorkflowLog {
  id?: string;
  workflow: string;
  trigger: string;
  status: string;
  durationMs: number;
}

export const automationApi = {
  getLogs: () => apiClient<{ logs: WorkflowLog[] }>('/automation/logs'),
  triggerWorkflow: (workflow: string) => apiClient<{ message: string }>('/automation/trigger', {
    method: 'POST',
    body: JSON.stringify({ workflow }),
  }),
};
