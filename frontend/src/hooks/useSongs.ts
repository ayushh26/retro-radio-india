import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { songsApi } from '../services/songs.api';
import type { SongsQuery, PaginatedSongs } from '../services/songs.api';
import type { Song } from '../services/api';

export function useSongs(query: SongsQuery = {}) {
  return useQuery<PaginatedSongs, Error>({
    queryKey: ['songs', query],
    queryFn: () => songsApi.getAll(query),
  });
}

export function useSong(id: string | undefined) {
  return useQuery<Song | null, Error>({
    queryKey: ['song', id],
    queryFn: () => (id ? songsApi.getById(id) : Promise.resolve(null)),
    enabled: !!id,
  });
}

export function useSongMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (songData: Partial<Song>) => songsApi.create(songData),
    onSuccess: (newSong) => {
      queryClient.invalidateQueries({ queryKey: ['songs'] });
      newSong.themes.forEach((theme) => {
        queryClient.invalidateQueries({ queryKey: ['radio', theme] });
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Song> }) => songsApi.update(id, data),
    onSuccess: (updatedSong) => {
      queryClient.invalidateQueries({ queryKey: ['songs'] });
      queryClient.invalidateQueries({ queryKey: ['song', updatedSong._id] });
      updatedSong.themes.forEach((theme) => {
        queryClient.invalidateQueries({ queryKey: ['radio', theme] });
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id }: { id: string; themes: string[] }) => songsApi.delete(id),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['songs'] });
      variables.themes.forEach((themeSlug: string) => {
        queryClient.invalidateQueries({ queryKey: ['radio', themeSlug] });
      });
    },
  });

  return {
    createSong: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateSong: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteSong: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
