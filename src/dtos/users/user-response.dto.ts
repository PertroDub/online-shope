import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsEmail, IsOptional, IsDate } from 'class-validator';

export class UserResponseDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  id: number;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  fullName: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+123456789' })
  @IsOptional()
  @IsString()
  phone: string;

  @ApiProperty({ example: '123 Main St, City' })
  @IsOptional()
  @IsString()
  address: string;

  @ApiProperty({ example: '2024-01-29T09:12:34.000Z' })
  @IsDate()
  createdAt: Date;

  @ApiProperty({ example: '2024-01-29T09:12:34.000Z' })
  @IsDate()
  updatedAt: Date;
} 