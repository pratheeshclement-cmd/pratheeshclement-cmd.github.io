import { apiClient } from '../core/apiClient';

export interface ProjectPayload {
  id?: string;
  title: string;
  description?: string;
  client?: string;
  category?: string;
  technologies?: string[];
  featured?: boolean;
}

export const projectsApi = {
  getProjects: () => apiClient<{ projects: ProjectPayload[] }>('/projects'),
  createProject: (data: ProjectPayload) => apiClient<{ project: ProjectPayload }>('/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  deleteProject: (id: string) => apiClient<{ message: string }>(`/projects/${id}`, {
    method: 'DELETE',
  }),
};
