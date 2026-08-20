import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { SongsModule } from '../songs/songs.module';
import { ThemesModule } from '../themes/themes.module';
import { AnalyticsModule } from '../analytics/analytics.module';

@Module({
  imports: [SongsModule, ThemesModule, AnalyticsModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
