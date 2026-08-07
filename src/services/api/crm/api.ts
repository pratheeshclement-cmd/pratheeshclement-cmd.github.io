import { apiClient } from '../core/apiClient';

export interface LeadPayload {
  name: string;
  email: string;
  company?: string;
  service?: string;
  message?: string;
  estimatedValue?: number;
}

export const crmApi = {
  getLeads: () => apiClient<{ leads: any[] }>('/crm/leads'),
  submitContact: (data: LeadPayload) => apiClient<{ message: string }>('/crm/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};
