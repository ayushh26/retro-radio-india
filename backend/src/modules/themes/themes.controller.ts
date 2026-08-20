import { Controller, Get, Param } from '@nestjs/common';
import { ThemesService } from './themes.service';
import { Theme } from './schemas/theme.schema';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('themes')
@Controller('themes')
export class ThemesController {
  constructor(private readonly themesService: ThemesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active themes' })
  async findAll(): Promise<Theme[]> {
    return this.themesService.findAll();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get theme by slug' })
  async findBySlug(@Param('slug') slug: string): Promise<Theme | null> {
    return this.themesService.findBySlug(slug);
  }
}
