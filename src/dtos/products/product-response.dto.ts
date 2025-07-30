import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsOptional, IsNumber, IsPositive, IsDate } from 'class-validator';

export class ProductResponseDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  id: number;

  @ApiProperty({ example: 'iPhone 15' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Latest Apple smartphone', nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 999.99 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @ApiProperty({ example: 10 })
  @IsInt()
  quantity: number;

  @ApiProperty({ example: 'https://example.com/image.png', nullable: true })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ example: '2025-07-30T10:00:00.000Z' })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ example: '2025-07-30T10:00:00.000Z' })
  @IsDate()
  updatedAt: Date;
} 