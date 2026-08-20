import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({ example: 'PLAY' })
  @IsString()
  @IsNotEmpty()
  event: string;

  @ApiProperty({ example: '65abcdef1234567890abcdef', required: false })
  @IsString()
  @IsOptional()
  songId?: string;

  @ApiProperty({ example: 'deluxe-salon', required: false })
  @IsString()
  @IsOptional()
  themeId?: string;

  @ApiProperty({ example: 'session-xyz-123' })
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @ApiProperty({ example: { player: 'youtube' }, required: false })
  @IsObject()
  @IsOptional()
  metadata?: any;
}
