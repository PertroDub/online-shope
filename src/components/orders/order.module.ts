import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity, OrderItemEntity, ProductEntity, UserEntity } from '@entities';
import { OrderRepository, ProductRepository, OrderItemRepository, UserRepository } from '@repositories';
import { OrderService } from '@providers';
import { OrderController } from '@controllers';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity, OrderItemEntity, ProductEntity, UserEntity])],
  providers: [OrderService, OrderRepository, ProductRepository, OrderItemRepository, UserRepository],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {} 