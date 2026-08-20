import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSongDto {
  @ApiProperty({ example: 'Khaike Paan Banaraswala', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: 'Kishore Kumar', required: false })
  @IsString()
  @IsOptional()
  artist?: string;

  @ApiProperty({ example: 'Don', required: false })
  @IsString()
  @IsOptional()
  movie?: string;

  @ApiProperty({ example: 1978, required: false })
  @IsNumber()
  @IsOptional()
  year?: number;

  @ApiProperty({ example: 'Hindi', required: false })
  @IsString()
  @IsOptional()
  language?: string;

  @ApiProperty({ example: 'S_E9v9m9x9w', required: false })
  @IsString()
  @IsOptional()
  youtubeVideoId?: string;

  @ApiProperty({
    example: 'https://img.youtube.com/vi/S_E9v9m9x9w/hqdefault.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  thumbnail?: string;

  @ApiProperty({ example: 240, required: false })
  @IsNumber()
  @IsOptional()
  duration?: number;

  @ApiProperty({ example: ['deluxe-salon', 'papa-ke-gaane'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  themes?: string[];

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
