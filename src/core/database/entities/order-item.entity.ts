import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { OrderEntity } from './order.entity';
import { ProductEntity } from './product.entity';

@Entity({ name: 'order_items' })
export class OrderItemEntity extends BaseEntity {
  @Column({ name: 'order_id', type: 'int' })
  public orderId: number;

  @ManyToOne(() => OrderEntity, (order) => order.items, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  public order: OrderEntity;

  @Column({ name: 'product_id', type: 'int' })
  public productId: number;

  @ManyToOne(() => ProductEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  public product: ProductEntity;

  @Column({ type: 'int' })
  public quantity: number;

  @Column({ name: 'unit_price', type: 'numeric', precision: 10, scale: 2 })
  public unitPrice: number;

  @Column({ name: 'line_total', type: 'numeric', precision: 10, scale: 2 })
  public lineTotal: number;
} 