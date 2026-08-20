import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Analytics } from './schemas/analytics.schema';
import { CreateEventDto } from './dto/create-event.dto';
import { Song } from '../songs/schemas/song.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Analytics.name) private analyticsModel: Model<Analytics>,
    @InjectModel(Song.name) private songModel: Model<Song>,
  ) {}

  async trackEvent(createEventDto: CreateEventDto): Promise<Analytics> {
    const createdEvent = new this.analyticsModel(createEventDto);
    const savedEvent = await createdEvent.save();

    // Proactively increment playCount if it's a song play event
    if ((createEventDto.event === 'PLAY' || createEventDto.event === 'COMPLETE') && createEventDto.songId) {
      try {
        await this.songModel.findByIdAndUpdate(
          createEventDto.songId,
          { $inc: { playCount: 1 } }
        ).exec();
      } catch (e) {
        console.error(`Failed to increment play count for song ${createEventDto.songId}:`, e);
      }
    }

    return savedEvent;
  }

  // Helper methods for admin dashboard statistics
  async getTotalPlays(): Promise<number> {
    return this.analyticsModel.countDocuments({ event: 'PLAY' }).exec();
  }

  async getMostPlayedSongs(limit = 5): Promise<any[]> {
    return this.songModel.find({ isActive: true }).sort({ playCount: -1 }).limit(limit).exec();
  }

  async getMostPopularThemes(): Promise<any[]> {
    // Aggregate play events by themeId
    return this.analyticsModel.aggregate([
      { $match: { event: 'PLAY', themeId: { $ne: null } } },
      { $group: { _id: '$themeId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]).exec();
  }
}
