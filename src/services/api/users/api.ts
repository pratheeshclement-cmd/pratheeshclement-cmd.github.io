import { apiClient } from '../core/apiClient';

export interface UserInviteData {
  email: string;
  role: string;
}

export const usersApi = {
  inviteUser: (data: UserInviteData) => apiClient<{ message: string }>('/users/invite', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateRole: (uid: string, role: string) => apiClient<{ message: string }>('/users/update-role', {
    method: 'POST',
    body: JSON.stringify({ uid, role }),
  }),
  suspendUser: (uid: string, status: string) => apiClient<{ message: string }>('/users/suspend', {
    method: 'POST',
    body: JSON.stringify({ uid, status }),
  }),
  resetPassword: (email: string) => apiClient<{ message: string }>('/users/reset-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),
};
