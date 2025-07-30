import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, Min, IsDateString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus, SortDirection } from '@enums';

export class FilterOrdersDto {
  @ApiPropertyOptional({ example: 1, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ example: 20, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 20;

  @ApiPropertyOptional({ enum: OrderStatus, example: OrderStatus.PROCESSING })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiPropertyOptional({ example: '2025-01-01', description: 'Start date (created_at >= from)' })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional({ example: '2025-12-31', description: 'End date (created_at <= to)' })
  @IsOptional()
  @IsDateString()
  to?: string;

  @ApiPropertyOptional({ example: 'created_at', enum: ['created_at', 'total_price'] })
  @IsOptional()
  @IsIn(['created_at', 'total_price'])
  sort_by?: 'created_at' | 'total_price' = 'created_at';

  @ApiPropertyOptional({ example: SortDirection.DESC, enum: SortDirection })
  @IsOptional()
  sort_order?: SortDirection = SortDirection.DESC;
} 