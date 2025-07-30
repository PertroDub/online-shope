import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '@entities';
import { FilterProductsDto } from '@dtos';
import { SortDirection } from '@enums';
import { applyTrigramSearch } from '../helpers/trigram-search.helper';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repository: Repository<ProductEntity>,
  ) {}

  

  async findAll() {
    return this.repository.find();
  }

  async findOne(id: number) {
    return this.repository.findOne({ where: { id } });
  }

  async createAndSave(data: Partial<ProductEntity>): Promise<ProductEntity> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async findFiltered(filter: FilterProductsDto): Promise<[ProductEntity[], number]> {
    const { page = 1, limit = 20, in_stock, min_price, max_price, search, sort_by, sort_order } = filter;

    const qb = this.repository.createQueryBuilder('product');

    if (in_stock) {
      qb.andWhere('product.quantity > 0');
    }
    if (min_price !== undefined) {
      qb.andWhere('product.price >= :min', { min: min_price });
    }
    if (max_price !== undefined) {
      qb.andWhere('product.price <= :max', { max: max_price });
    }
    if (search) {
      applyTrigramSearch(qb, 'product', ['name', 'description'], search);
    }

    const sortField = sort_by ?? 'created_at';
    const orderDir = (sort_order ?? SortDirection.ASC).toUpperCase() as SortDirection;
    qb.orderBy(`product.${sortField}`, orderDir);

    qb.skip((page - 1) * limit).take(limit);

    return qb.getManyAndCount();
  }

  async updateById(id: number, data: Partial<ProductEntity>): Promise<ProductEntity> {
    await this.repository.update(id, data);
    return this.findOne(id);
  }

  async deleteById(id: number) {
    await this.repository.delete(id);
  }
} 