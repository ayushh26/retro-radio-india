import { Controller, Get, Param, Query } from '@nestjs/common';
import { SongsService } from './songs.service';
import { Song } from './schemas/song.schema';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('songs')
@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active songs with pagination and filters' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'artist', required: false, type: String })
  @ApiQuery({ name: 'year', required: false, type: Number })
  @ApiQuery({ name: 'theme', required: false, type: String })
  async findAll(@Query() query: any) {
    return this.songsService.findAll(query);
  }

  @Get('theme/:slug')
  @ApiOperation({ summary: 'Get active songs by theme slug' })
  async findByTheme(@Param('slug') slug: string): Promise<Song[]> {
    return this.songsService.findByTheme(slug);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get song by ID' })
  async findById(@Param('id') id: string): Promise<Song | null> {
    return this.songsService.findById(id);
  }
}
