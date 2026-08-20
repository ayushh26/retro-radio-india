import { api } from './api';
import type { Song } from './api';

export interface SongsQuery {
  page?: number;
  limit?: number;
  search?: string;
  artist?: string;
  year?: number;
  theme?: string;
}

export interface PaginatedSongs {
  songs: Song[];
  total: number;
  page: number;
  limit: number;
}

export const songsApi = {
  getAll: (query: SongsQuery = {}) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        params.append(key, String(val));
      }
    });
    return api.get<PaginatedSongs>(`/songs?${params.toString()}`);
  },
  getById: (id: string) => api.get<Song>(`/songs/${id}`),
};
