import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base.entity';
import { Category } from '../../categories/entities/category.entity';
import { Supplier } from '../../suppliers/entities/supplier.entity';

@Entity('products')
@Index(['category'])
@Index(['supplier'])
export class Product extends BaseEntity {
  @Column({ type: 'varchar', length: 150 })
  name!: string;

  @Column({ type: 'varchar', length: 100 })
  sku!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @ManyToOne(() => Category, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'category_id' })
  category!: Category;

  @ManyToOne(() => Supplier, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'supplier_id' })
  supplier!: Supplier;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
  })
  costPrice!: string;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
  })
  sellingPrice!: string;

  @Column({ type: 'integer', default: 0 })
  currentStock!: number;

  @Column({ type: 'integer', default: 0 })
  reorderLevel!: number;
}
