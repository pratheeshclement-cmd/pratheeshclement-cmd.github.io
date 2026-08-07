import { apiClient } from '../core/apiClient';

export interface ProfileData {
  displayName?: string;
  email?: string;
  phone?: string;
  location?: string;
  jobTitle?: string;
  bio?: string;
}

export const profileApi = {
  getProfile: () => apiClient<{ profile: ProfileData }>('/profile'),
  updateProfile: (data: ProfileData) => apiClient<{ message: string; profile: ProfileData }>('/profile', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};
