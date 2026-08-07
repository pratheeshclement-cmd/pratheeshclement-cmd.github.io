import { apiClient } from '../core/apiClient';

export interface SystemSettingsData {
  appName?: string;
  siteUrl?: string;
  maintenanceMode?: boolean;
}

export const settingsApi = {
  getSettings: () => apiClient<{ settings: SystemSettingsData }>('/settings/system'),
  updateSettings: (data: SystemSettingsData) => apiClient<{ settings: SystemSettingsData; message: string }>('/settings/system', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};
