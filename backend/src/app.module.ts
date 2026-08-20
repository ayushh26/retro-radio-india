import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThemesModule } from './modules/themes/themes.module';
import { SongsModule } from './modules/songs/songs.module';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from './common/redis/redis.module';
import { RadioModule } from './modules/radio/radio.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/retro_radio_india'),
    ThemesModule,
    SongsModule,
    DatabaseModule,
    RedisModule,
    RadioModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
