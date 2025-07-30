import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { ERROR_MESSAGES } from '@constants';
import { ProductRepository } from '@repositories';
import { CreateProductDto, ProductResponseDto, FilterProductsDto, UpdateProductDto, PaginatedResponseDto } from '@dtos';


@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);
  constructor(private readonly productRepository: ProductRepository) {}

  async findAll(filter: FilterProductsDto): Promise<PaginatedResponseDto<ProductResponseDto>> {
    try {
      const { page, limit } = filter;
      const [items, total] = await this.productRepository.findFiltered(filter);
      return {
        items: items as unknown as ProductResponseDto[],
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      } as PaginatedResponseDto<ProductResponseDto>;
    } catch (error) {
      this.logger.error(`findAll error: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const product = await this.productRepository.findOne(id);
      if (!product) throw new NotFoundException(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
      return product;
    } catch (error) {
      this.logger.error(`findOne error: ${error.message}`, error.stack);
      throw error;
    }
  }

  async create(dto: CreateProductDto): Promise<ProductResponseDto> {
    try {
      const product = await this.productRepository.createAndSave({
        name: dto.name,
        description: dto.description,
        price: dto.price,
        quantity: dto.quantity ?? 0,
        imageUrl: dto.imageUrl,
      });
      return product as unknown as ProductResponseDto;
    } catch (error) {
      this.logger.error(`create error: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: number, dto: UpdateProductDto): Promise<ProductResponseDto> {
    try {
      const product = await this.productRepository.updateById(id, dto);
      if (!product) throw new NotFoundException(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
      return product as unknown as ProductResponseDto;
    } catch (error) {
      this.logger.error(`update error: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const product = await this.productRepository.findOne(id);
      if (!product) throw new NotFoundException(ERROR_MESSAGES.PRODUCT_NOT_FOUND);
      await this.productRepository.deleteById(id);
    } catch (error) {
      this.logger.error(`remove error: ${error.message}`, error.stack);
      throw error;
    }
  }
} 