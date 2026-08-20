import { IsString, IsArray, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateThemeDto {
  @ApiProperty({ example: 'Deluxe Salon', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'deluxe-salon', required: false })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({ example: 'The classic Indian barbershop experience.', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '✂️', required: false })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiProperty({ example: 'https://example.com/salon-bg.jpg', required: false })
  @IsString()
  @IsOptional()
  backgroundImage?: string;

  @ApiProperty({ example: '#d32f2f', required: false })
  @IsString()
  @IsOptional()
  accentColor?: string;

  @ApiProperty({ example: 'https://example.com/salon-character.png', required: false })
  @IsString()
  @IsOptional()
  characterImage?: string;

  @ApiProperty({ example: ['Bhaiya, thoda side se chhota kar dena.'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  quotes?: string[];

  @ApiProperty({ example: 'https://example.com/salon-ambient.mp3', required: false })
  @IsString()
  @IsOptional()
  ambientSound?: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
