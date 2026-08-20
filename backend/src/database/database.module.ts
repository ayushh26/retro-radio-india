import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedService } from './seeds/seed.service';
import { ThemesModule } from '../modules/themes/themes.module';
import { SongsModule } from '../modules/songs/songs.module';
import { RedisModule } from '../common/redis/redis.module';
import { Song, SongSchema } from '../modules/songs/schemas/song.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Song.name, schema: SongSchema }]),
    ThemesModule,
    SongsModule,
    RedisModule,
  ],
  providers: [SeedService],
})
export class DatabaseModule {}
