import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Theme } from './schemas/theme.schema';
import { RedisService } from '../../common/redis/redis.service';
import { CreateThemeDto } from './dto/create-theme.dto';
import { UpdateThemeDto } from './dto/update-theme.dto';

@Injectable()
export class ThemesService {
  constructor(
    @InjectModel(Theme.name) private themeModel: Model<Theme>,
    private readonly redisService: RedisService,
  ) {}

  async findAll(): Promise<Theme[]> {
    const cacheKey = 'themes:all';
    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error('Failed to parse cached themes:', e);
      }
    }

    const themes = await this.themeModel.find({ isActive: true }).exec();
    await this.redisService.set(cacheKey, JSON.stringify(themes), 3600); // cache for 1 hour
    return themes;
  }

  async findBySlug(slug: string): Promise<Theme | null> {
    return this.themeModel.findOne({ slug, isActive: true }).exec();
  }

  async findById(id: string): Promise<Theme | null> {
    return this.themeModel.findById(id).exec();
  }

  async create(createThemeDto: CreateThemeDto): Promise<Theme> {
    const createdTheme = new this.themeModel(createThemeDto);
    const saved = await createdTheme.save();
    await this.invalidateCache(saved.slug);
    return saved;
  }

  async update(id: string, updateThemeDto: UpdateThemeDto): Promise<Theme> {
    const theme = await this.themeModel.findById(id).exec();
    if (!theme) {
      throw new NotFoundException(`Theme with ID ${id} not found`);
    }

    const originalSlug = theme.slug;
    const updated = await this.themeModel
      .findByIdAndUpdate(id, { $set: updateThemeDto }, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException(`Theme with ID ${id} not found`);
    }

    await this.invalidateCache(originalSlug);
    if (updated.slug !== originalSlug) {
      await this.invalidateCache(updated.slug);
    }

    return updated;
  }

  async remove(id: string): Promise<Theme> {
    const theme = await this.themeModel.findById(id).exec();
    if (!theme) {
      throw new NotFoundException(`Theme with ID ${id} not found`);
    }

    await this.themeModel.findByIdAndDelete(id).exec();
    await this.invalidateCache(theme.slug);
    return theme;
  }

  async upsertMany(themes: any[]): Promise<void> {
    for (const theme of themes) {
      await this.themeModel.updateOne(
        { slug: theme.slug },
        { $set: theme },
        { upsert: true },
      );
      await this.invalidateCache(theme.slug);
    }
  }

  private async invalidateCache(slug: string) {
    await this.redisService.del('themes:all');
    await this.redisService.del(`radio:${slug}`);
  }
}
