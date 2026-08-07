import { apiClient } from '../core/apiClient';

export interface BlogPayload {
  id?: string;
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  status?: string;
}

export const blogsApi = {
  getBlogs: () => apiClient<{ blogs: BlogPayload[] }>('/blog/posts'),
  publishBlog: (data: BlogPayload) => apiClient<{ blog: BlogPayload }>('/blog/publish', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  deleteBlog: (id: string) => apiClient<{ message: string }>(`/blog/posts/${id}`, {
    method: 'DELETE',
  }),
};
