import { Controller, Get, Param, ParseIntPipe, Post, Body, Query, Put, HttpCode, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiParam, ApiBody, ApiCreatedResponse, ApiNoContentResponse } from '@nestjs/swagger';
import { ProductService } from '@providers';
import { CreateProductDto, ProductResponseDto, FilterProductsDto, UpdateProductDto, PaginatedResponseDto } from '@dtos';


@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiOkResponse({ type: ProductResponseDto, isArray: true })
  findAll(@Query() query: FilterProductsDto): Promise<PaginatedResponseDto<ProductResponseDto>> {
    return this.productService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiOkResponse({ type: ProductResponseDto })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new product' })
  @ApiBody({ type: CreateProductDto })
  @ApiCreatedResponse({ type: ProductResponseDto })
  create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update product' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateProductDto })
  @ApiOkResponse({ type: ProductResponseDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    return this.productService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete product' })
  @ApiParam({ name: 'id', type: Number })
  @ApiNoContentResponse({ description: 'Product deleted' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.productService.remove(id);
  }
} 