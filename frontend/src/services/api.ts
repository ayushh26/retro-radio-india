export const API_BASE_URL = '/api';

export interface Song {
  _id: string;
  title: string;
  artist: string;
  movie?: string;
  year?: number;
  language?: string;
  youtubeVideoId: string;
  thumbnail?: string;
  duration?: number;
  themes: string[];
  isActive: boolean;
  playCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Theme {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  backgroundImage?: string;
  accentColor?: string;
  characterImage?: string;
  quotes: string[];
  ambientSound?: string;
  isActive: boolean;
}

export interface RadioPlaylist {
  theme: {
    name: string;
    slug: string;
    icon?: string;
    description?: string;
    backgroundImage?: string;
    accentColor?: string;
    characterImage?: string;
    quotes: string[];
    ambientSound?: string;
  };
  songs: Song[];
  total: number;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});

  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API error: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),
};
