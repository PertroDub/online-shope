import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsNumber, IsOptional, Min, IsIn, IsString, Max, IsEnum } from 'class-validator';
import { SortDirection } from '@enums';
import { ProductSortField } from '@enums';

export class FilterProductsDto {
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
  @Max(100)
  @IsOptional()
  limit?: number = 20;

  @ApiPropertyOptional({ example: true })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  in_stock?: boolean;

  @ApiPropertyOptional({ example: 0 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  min_price?: number;

  @ApiPropertyOptional({ example: 1000 })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  max_price?: number;

  @ApiPropertyOptional({ example: 'iphone', description: 'Search term for name or description' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 'price', enum: ProductSortField })
  @IsOptional()
  @IsEnum(ProductSortField)
  sort_by?: ProductSortField = ProductSortField.CREATED_AT;

  @ApiPropertyOptional({ example: SortDirection.ASC, enum: SortDirection })
  @IsOptional()
  sort_order?: SortDirection = SortDirection.ASC;
} 