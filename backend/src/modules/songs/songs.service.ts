import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Song } from './schemas/song.schema';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { RedisService } from '../../common/redis/redis.service';

@Injectable()
export class SongsService {
  constructor(
    @InjectModel(Song.name) private songModel: Model<Song>,
    private readonly redisService: RedisService,
  ) {}

  async findAll(queryParams: {
    page?: number;
    limit?: number;
    search?: string;
    artist?: string;
    year?: number;
    theme?: string;
    all?: boolean;
  } = {}): Promise<{ songs: Song[]; total: number; page: number; limit: number }> {
    const page = queryParams.page ? Number(queryParams.page) : 1;
    const limit = queryParams.limit ? Number(queryParams.limit) : 20;
    const skip = (page - 1) * limit;

    const filter: any = {};

    // For public users, only active songs are returned. Admin can query all using `all=true`.
    if (!queryParams.all) {
      filter.isActive = true;
    }

    if (queryParams.artist) {
      filter.artist = { $regex: new RegExp(queryParams.artist, 'i') };
    }

    if (queryParams.year) {
      filter.year = Number(queryParams.year);
    }

    if (queryParams.theme) {
      filter.themes = queryParams.theme;
    }

    if (queryParams.search) {
      const searchRegex = new RegExp(queryParams.search, 'i');
      filter.$or = [
        { title: searchRegex },
        { artist: searchRegex },
        { movie: searchRegex },
      ];
    }

    const [songs, total] = await Promise.all([
      this.songModel.find(filter).skip(skip).limit(limit).exec(),
      this.songModel.countDocuments(filter).exec(),
    ]);

    return {
      songs,
      total,
      page,
      limit,
    };
  }

  async findByTheme(themeSlug: string): Promise<Song[]> {
    const cacheKey = `radio:${themeSlug}`;
    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error('Failed to parse cached radio playlist:', e);
      }
    }

    const songs = await this.songModel.find({ themes: themeSlug, isActive: true }).exec();
    await this.redisService.set(cacheKey, JSON.stringify(songs), 1800); // cache for 30 minutes
    return songs;
  }

  async findById(id: string): Promise<Song | null> {
    return this.songModel.findById(id).exec();
  }

  async create(createSongDto: CreateSongDto): Promise<Song> {
    const createdSong = new this.songModel(createSongDto);
    const saved = await createdSong.save();
    if (saved.themes && saved.themes.length > 0) {
      await this.invalidateThemesCache(saved.themes);
    }
    return saved;
  }

  async update(id: string, updateSongDto: UpdateSongDto): Promise<Song> {
    const song = await this.songModel.findById(id).exec();
    if (!song) {
      throw new NotFoundException(`Song with ID ${id} not found`);
    }

    const originalThemes = song.themes || [];
    const updated = await this.songModel
      .findByIdAndUpdate(id, { $set: updateSongDto }, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException(`Song with ID ${id} not found`);
    }

    const newThemes = updated.themes || [];
    const allAffectedThemes = Array.from(new Set([...originalThemes, ...newThemes]));
    if (allAffectedThemes.length > 0) {
      await this.invalidateThemesCache(allAffectedThemes);
    }

    return updated;
  }

  async remove(id: string): Promise<Song> {
    const song = await this.songModel.findById(id).exec();
    if (!song) {
      throw new NotFoundException(`Song with ID ${id} not found`);
    }

    await this.songModel.findByIdAndDelete(id).exec();
    if (song.themes && song.themes.length > 0) {
      await this.invalidateThemesCache(song.themes);
    }
    return song;
  }

  async upsertMany(songs: any[]): Promise<void> {
    const affectedThemes = new Set<string>();
    for (const song of songs) {
      await this.songModel.updateOne(
        { title: song.title, themes: { $in: song.themes || [] } },
        { $set: song },
        { upsert: true },
      );
      if (song.themes) {
        song.themes.forEach((theme) => affectedThemes.add(theme));
      }
    }
    if (affectedThemes.size > 0) {
      await this.invalidateThemesCache(Array.from(affectedThemes));
    }
  }

  async deleteAll(): Promise<void> {
    await this.songModel.deleteMany({}).exec();
  }

  private async invalidateThemesCache(themes: string[]) {
    for (const theme of themes) {
      await this.redisService.del(`radio:${theme}`);
    }
  }
}
