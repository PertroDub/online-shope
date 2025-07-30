import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { CreateOrderDto, FilterOrdersDto, UpdateOrderStatusDto, PaginatedResponseDto } from '@dtos';
import { OrderRepository, ProductRepository, OrderItemRepository, UserRepository } from '@repositories';
import { OrderStatus } from '@enums';
import { CreateOrderItemDto } from '@dtos';
import { ERROR_MESSAGES } from '@constants';


@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly productRepository: ProductRepository,
    private readonly orderItemRepository: OrderItemRepository,
    private readonly userRepository: UserRepository,
  ) {}

  

  async findOne(id: number) {
    try {
      const order = await this.orderRepository.findOne(id);
      if (!order) throw new NotFoundException(ERROR_MESSAGES.ORDER_NOT_FOUND);
      return order;
    } catch (error) {
      this.logger.error(`findOne error: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOneDetailed(id: number) {
    try {
      const order = await this.orderRepository.findOneDetailed(id);
      if (!order) throw new NotFoundException('Order not found');
      return order;
    } catch (error) {
      this.logger.error(`findOneDetailed error: ${error.message}`, error.stack);
      throw error;
    }
  }

  async create(dto: CreateOrderDto) {
    try {
      const user = await this.userRepository.findOne(dto.userId);
      if (!user) throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
      const { total, itemsData } = await this._calculateTotalAndItems(dto.items);

      const order = await this.orderRepository.createAndSave({
        userId: dto.userId,
        status: OrderStatus.PROCESSING,
        totalPrice: total,
      });

      await this.orderItemRepository.createMany(itemsData.map((i) => ({ ...i, orderId: order.id })));

      return this.findOne(order.id);
    } catch (error) {
      this.logger.error(`create error: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findByUser(userId: number, filter: FilterOrdersDto): Promise<PaginatedResponseDto<any>> {
    try {
      const { page = 1, limit = 20 } = filter;
      const [items, total] = await this.orderRepository.findByUserFiltered(userId, filter);
      return {
        items,
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      } as PaginatedResponseDto<any>;
    } catch (error) {
      this.logger.error(`findByUser error: ${error.message}`, error.stack);
      throw error;
    }
  }

  async cancel(orderId: number, userId: number) {
    try {
      const order = await this.orderRepository.findOne(orderId);
      if (!order) throw new NotFoundException(ERROR_MESSAGES.ORDER_NOT_FOUND);
      if (order.userId !== userId) throw new ForbiddenException(ERROR_MESSAGES.FORBIDDEN);
      if (order.status === OrderStatus.CANCELLED) return order;
      const updated = await this.orderRepository.updateStatus(orderId, OrderStatus.CANCELLED);
      return updated;
    } catch (error) {
      this.logger.error(`cancel error: ${error.message}`, error.stack);
      throw error;
    }
  }

  async updateStatus(orderId: number, dto: UpdateOrderStatusDto) {
    try {
      const order = await this.orderRepository.findOne(orderId);
      if (!order) throw new NotFoundException(ERROR_MESSAGES.ORDER_NOT_FOUND);
      const updated = await this.orderRepository.updateStatus(orderId, dto.status);
      return updated;
    } catch (error) {
      this.logger.error(`updateStatus error: ${error.message}`, error.stack);
      throw error;
    }
  }

  

  private async _calculateTotalAndItems(items: CreateOrderItemDto[]): Promise<{ total: number; itemsData: any[] }> {
    let total = 0;
    const itemsData = [];

    for (const item of items) {
      const product = await this.productRepository.findOne(item.productId);
      if (!product) throw new NotFoundException(`Product ${item.productId} not found`);

      const unitPrice = Number(product.price);
      const lineTotal = unitPrice * item.quantity;
      total += lineTotal;

      itemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice,
        lineTotal,
      });
    }

    return { total, itemsData };
  }
} 