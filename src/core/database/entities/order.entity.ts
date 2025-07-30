import { Column, Entity, ManyToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { UserEntity } from './user.entity';
import { OrderStatus } from '../../../enums';
import { OrderItemEntity } from './order-item.entity';

@Entity({ name: 'orders' })
export class OrderEntity extends BaseEntity {
  @Column({ name: 'user_id', type: 'int' })
  public userId: number;

  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  public user: UserEntity;

  @Index('idx_orders_status')
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PROCESSING })
  public status: OrderStatus;

  @Column({ name: 'total_price', type: 'numeric', precision: 10, scale: 2 })
  public totalPrice: number;

  @OneToMany(() => OrderItemEntity, (item) => item.order)
  public items: OrderItemEntity[];
} 