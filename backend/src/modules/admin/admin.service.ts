import { Injectable } from '@nestjs/common';
import { SongsService } from '../songs/songs.service';
import { ThemesService } from '../themes/themes.service';
import { AnalyticsService } from '../analytics/analytics.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly songsService: SongsService,
    private readonly themesService: ThemesService,
    private readonly analyticsService: AnalyticsService,
  ) {}

  async getDashboardStats() {
    const [themesResult, songsResult, totalPlays, mostPlayedSongs, popularThemes] = await Promise.all([
      this.themesService.findAll(),
      this.songsService.findAll({ page: 1, limit: 1, all: true }),
      this.analyticsService.getTotalPlays(),
      this.analyticsService.getMostPlayedSongs(5),
      this.analyticsService.getMostPopularThemes(),
    ]);

    // Fetch theme names for popular themes list
    const formattedPopularThemes = await Promise.all(
      popularThemes.map(async (pt) => {
        const theme = await this.themesService.findBySlug(pt._id);
        return {
          slug: pt._id,
          name: theme ? theme.name : pt._id,
          count: pt.count,
        };
      })
    );

    return {
      totalThemes: themesResult.length,
      totalSongs: songsResult.total,
      totalPlays,
      mostPlayedSong: mostPlayedSongs.length > 0 ? mostPlayedSongs[0] : null,
      mostPlayedSongs,
      popularThemes: formattedPopularThemes,
    };
  }
}
