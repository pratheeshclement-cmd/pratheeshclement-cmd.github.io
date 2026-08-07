import { apiClient } from '../core/apiClient';

export interface MediaPayload {
  id?: string;
  name: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
}

export const mediaApi = {
  getMedia: () => apiClient<{ items: MediaPayload[] }>('/media'),
  deleteMedia: (id: string) => apiClient<{ message: string }>(`/media/${id}`, {
    method: 'DELETE',
  }),
};
