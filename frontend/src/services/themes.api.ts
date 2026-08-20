import { api } from './api';
import type { Theme } from './api';

export const themesApi = {
  getAll: () => api.get<Theme[]>('/themes'),
  getBySlug: (slug: string) => api.get<Theme>(`/themes/${slug}`),
  create: (data: Partial<Theme>) => api.post<Theme>('/themes', data),
  update: (id: string, data: Partial<Theme>) => api.patch<Theme>(`/themes/${id}`, data),
  delete: (id: string) => api.delete<void>(`/themes/${id}`),
};
