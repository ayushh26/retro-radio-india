import { Injectable, NotFoundException } from '@nestjs/common';
import { ThemesService } from '../themes/themes.service';
import { SongsService } from '../songs/songs.service';

@Injectable()
export class RadioService {
  constructor(
    private readonly themesService: ThemesService,
    private readonly songsService: SongsService,
  ) {}

  async getRadioPlaylist(themeSlug: string) {
    const theme = await this.themesService.findBySlug(themeSlug);
    if (!theme) {
      throw new NotFoundException(`Theme with slug "${themeSlug}" not found`);
    }

    const songs = await this.songsService.findByTheme(themeSlug);

    return {
      theme: {
        name: theme.name,
        slug: theme.slug,
        icon: theme.icon,
        description: theme.description,
        backgroundImage: theme.backgroundImage,
        accentColor: theme.accentColor,
        characterImage: theme.characterImage,
        quotes: theme.quotes,
        ambientSound: theme.ambientSound,
      },
      songs,
      total: songs.length,
    };
  }
}
