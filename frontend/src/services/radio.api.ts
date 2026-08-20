import { api } from './api';
import type { RadioPlaylist } from './api';

export const radioApi = {
  getPlaylist: (themeSlug: string) => api.get<RadioPlaylist>(`/radio/${themeSlug}`),
};
