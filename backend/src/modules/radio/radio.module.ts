import { Module } from '@nestjs/common';
import { RadioController } from './radio.controller';
import { RadioService } from './radio.service';
import { ThemesModule } from '../themes/themes.module';
import { SongsModule } from '../songs/songs.module';

@Module({
  imports: [ThemesModule, SongsModule],
  controllers: [RadioController],
  providers: [RadioService],
})
export class RadioModule {}
