import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity} from '@entities';
import { FilterOrdersDto } from '@dtos';
import { OrderStatus, SortDirection } from '@enums';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly repository: Repository<OrderEntity>,
  ) {}

  
  async findAll() {
    return this.repository.find();
  }

  async findOne(id: number) {
    return this.repository.findOne({ where: { id } });
  }

  async createAndSave(data: Partial<OrderEntity>): Promise<OrderEntity> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async findByUserFiltered(userId: number, filter: FilterOrdersDto) {
    const { page = 1, limit = 20, status, from, to, sort_by, sort_order } = filter;
    const qb = this.repository.createQueryBuilder('orders').where('orders.userId = :uid', { uid: userId });
    if (status) {
      qb.andWhere('orders.status = :status', { status });
    }
    if (from) {
      qb.andWhere('orders.createdAt >= :from', { from });
    }
    if (to) {
      qb.andWhere('orders.createdAt <= :to', { to });
    }
    qb.skip((page - 1) * limit).take(limit);
    const sortField = sort_by ?? 'created_at';
    const dir = (sort_order ?? 'desc').toUpperCase() as SortDirection;
    qb.orderBy(`orders.${sortField}`, dir);
    return qb.getManyAndCount();
  }

  async updateStatus(id: number, status: OrderStatus) {
    await this.repository.update(id, { status });
    return this.findOne(id);
  }

  async findOneDetailed(id: number) {
    return this.repository.createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'item')
      .leftJoinAndSelect('item.product', 'product')
      .where('order.id = :id', { id })
      .getOne();
  }
} 