import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base.entity';

import { Product } from '../../../inventory/products/entities/product.entity';

import { Invoice } from './invoice.entity';

@Entity('invoice_items')
@Index(['invoiceId'])
@Index(['productId'])
export class InvoiceItem extends BaseEntity {
  @Column({
    name: 'invoice_id',
    type: 'uuid',
  })
  invoiceId!: string;

  @ManyToOne(() => Invoice, (invoice) => invoice.items, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'invoice_id' })
  invoice!: Invoice;

  @Column({
    name: 'product_id',
    type: 'uuid',
  })
  productId!: string;

  @ManyToOne(() => Product, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'product_id' })
  product!: Product;

  // Product snapshot at invoice creation time
  @Column({
    name: 'product_name',
    type: 'varchar',
    length: 255,
  })
  productName!: string;

  @Column({
    type: 'integer',
  })
  quantity!: number;

  @Column({
    name: 'unit_price',
    type: 'numeric',
    precision: 12,
    scale: 2,
  })
  unitPrice!: string;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
  })
  subtotal!: string;
}
