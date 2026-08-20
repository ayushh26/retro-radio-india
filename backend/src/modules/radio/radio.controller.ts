import { Controller, Get, Param } from '@nestjs/common';
import { RadioService } from './radio.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('radio')
@Controller('radio')
export class RadioController {
  constructor(private readonly radioService: RadioService) {}

  @Get(':themeSlug')
  @ApiOperation({ summary: 'Get radio playlist for a specific theme' })
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 404, description: 'Theme not found' })
  async getRadioPlaylist(@Param('themeSlug') themeSlug: string) {
    return this.radioService.getRadioPlaylist(themeSlug);
  }
}
