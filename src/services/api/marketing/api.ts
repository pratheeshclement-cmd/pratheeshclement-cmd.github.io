import { apiClient } from '../core/apiClient';

export interface CampaignData {
  id?: string;
  name: string;
  platform: string;
  spend: number | string;
  budget?: number | string;
  status?: string;
  notes?: string;
}

export const marketingApi = {
  getCampaigns: () => apiClient<{ campaigns: CampaignData[] }>('/marketing/campaigns'),
  createCampaign: (data: CampaignData) => apiClient<{ campaign: CampaignData }>('/marketing/campaigns', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  deleteCampaign: (id: string) => apiClient<{ message: string }>(`/marketing/campaigns/${id}`, {
    method: 'DELETE',
  }),
};
