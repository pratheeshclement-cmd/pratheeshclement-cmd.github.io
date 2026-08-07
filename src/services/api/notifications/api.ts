import { apiClient } from '../core/apiClient';

export interface NotificationPayload {
  id?: string;
  title: string;
  desc: string;
  read: boolean;
  priority: string;
}

export const notificationsApi = {
  getNotifications: () => apiClient<{ notifications: NotificationPayload[] }>('/notifications'),
  markAllRead: () => apiClient<{ message: string }>('/notifications/read-all', {
    method: 'POST',
  }),
};
