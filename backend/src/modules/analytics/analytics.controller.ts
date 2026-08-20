import { Controller, Post, Body } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { CreateEventDto } from './dto/create-event.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('events')
  @ApiOperation({ summary: 'Track user playback event' })
  @ApiResponse({ status: 201, description: 'Event tracked successfully' })
  async trackEvent(@Body() createEventDto: CreateEventDto) {
    try {
      return await this.analyticsService.trackEvent(createEventDto);
    } catch (e) {
      // Analytics must never block music playback or crash the client, fail gracefully
      console.error('Analytics event tracking failed:', e);
      return { status: 'failed', error: e.message };
    }
  }
}
