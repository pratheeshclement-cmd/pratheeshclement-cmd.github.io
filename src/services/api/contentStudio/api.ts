import { apiClient } from '../core/apiClient';

export interface QueueItem {
  id?: string;
  title: string;
  platform: string;
  scheduledAt?: string;
  status?: string;
}

export const contentStudioApi = {
  getQueue: () => apiClient<{ items: QueueItem[] }>('/content-studio/queue'),
  createQueueItem: (data: QueueItem) => apiClient<{ item: QueueItem }>('/content-studio/queue', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  deleteQueueItem: (id: string) => apiClient<{ message: string }>(`/content-studio/queue/${id}`, {
    method: 'DELETE',
  }),
};
