import { useQuery } from '@tanstack/react-query';
import { radioApi } from '../services/radio.api';
import type { RadioPlaylist } from '../services/api';

export function useRadio(themeSlug: string | undefined) {
  return useQuery<RadioPlaylist | null, Error>({
    queryKey: ['radio', themeSlug],
    queryFn: () => (themeSlug ? radioApi.getPlaylist(themeSlug) : Promise.resolve(null)),
    enabled: !!themeSlug,
  });
}
