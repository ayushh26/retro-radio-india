import { IsString, IsNotEmpty, IsArray, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateThemeDto {
  @ApiProperty({ example: 'Deluxe Salon' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'deluxe-salon' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'The classic Indian barbershop experience.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '✂️' })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiProperty({ example: 'https://example.com/salon-bg.jpg' })
  @IsString()
  @IsOptional()
  backgroundImage?: string;

  @ApiProperty({ example: '#d32f2f' })
  @IsString()
  @IsOptional()
  accentColor?: string;

  @ApiProperty({ example: 'https://example.com/salon-character.png' })
  @IsString()
  @IsOptional()
  characterImage?: string;

  @ApiProperty({ example: ['Bhaiya, thoda side se chhota kar dena.'] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  quotes?: string[];

  @ApiProperty({ example: 'https://example.com/salon-ambient.mp3' })
  @IsString()
  @IsOptional()
  ambientSound?: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
