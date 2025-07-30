import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItemEntity } from '@entities';

@Injectable()
export class OrderItemRepository {
  constructor(
    @InjectRepository(OrderItemEntity)
    private readonly repository: Repository<OrderItemEntity>,
  ) {}

  

  async createMany(items: Partial<OrderItemEntity>[]): Promise<OrderItemEntity[]> {
    const entities = this.repository.create(items);
    return this.repository.save(entities);
  }
} 