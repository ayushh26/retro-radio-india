import { api } from './api';
import type { Theme } from './api';

export const themesApi = {
  getAll: () => api.get<Theme[]>('/themes'),
  getBySlug: (slug: string) => api.get<Theme>(`/themes/${slug}`),
};
