import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { themesApi } from '../services/themes.api';
import type { Theme } from '../services/api';

export function useThemes() {
  return useQuery<Theme[], Error>({
    queryKey: ['themes'],
    queryFn: () => themesApi.getAll(),
  });
}

export function useTheme(slug: string | undefined) {
  return useQuery<Theme | null, Error>({
    queryKey: ['theme', slug],
    queryFn: () => (slug ? themesApi.getBySlug(slug) : Promise.resolve(null)),
    enabled: !!slug,
  });
}

export function useThemeMutations() {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (themeData: Partial<Theme>) => themesApi.create(themeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['themes'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Theme> }) => themesApi.update(id, data),
    onSuccess: (updatedTheme) => {
      queryClient.invalidateQueries({ queryKey: ['themes'] });
      queryClient.invalidateQueries({ queryKey: ['theme', updatedTheme.slug] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => themesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['themes'] });
    },
  });

  return {
    createTheme: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateTheme: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteTheme: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
