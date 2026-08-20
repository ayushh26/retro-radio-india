import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSongDto {
  @ApiProperty({ example: 'Khaike Paan Banaraswala' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Kishore Kumar' })
  @IsString()
  @IsNotEmpty()
  artist: string;

  @ApiProperty({ example: 'Don' })
  @IsString()
  @IsOptional()
  movie?: string;

  @ApiProperty({ example: 1978 })
  @IsNumber()
  @IsOptional()
  year?: number;

  @ApiProperty({ example: 'Hindi' })
  @IsString()
  @IsOptional()
  language?: string;

  @ApiProperty({ example: 'S_E9v9m9x9w' })
  @IsString()
  @IsNotEmpty()
  youtubeVideoId: string;

  @ApiProperty({
    example: 'https://img.youtube.com/vi/S_E9v9m9x9w/hqdefault.jpg',
  })
  @IsString()
  @IsOptional()
  thumbnail?: string;

  @ApiProperty({ example: 240 })
  @IsNumber()
  @IsOptional()
  duration?: number;

  @ApiProperty({ example: ['deluxe-salon', 'papa-ke-gaane'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  themes?: string[];

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
