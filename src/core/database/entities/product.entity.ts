import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'products' })
export class ProductEntity extends BaseEntity {
  @Index('idx_products_name')
  @Column({ type: 'varchar', length: 255 })
  public name: string;

  @Column({ type: 'text', nullable: true })
  public description: string;

  @Index('idx_products_price')
  @Column({ type: 'numeric', precision: 10, scale: 2 })
  public price: number;

  @Column({ type: 'int', default: 0 })
  public quantity: number;

  @Column({ name: 'image_url', type: 'varchar', length: 255, nullable: true })
  public imageUrl: string;
} 