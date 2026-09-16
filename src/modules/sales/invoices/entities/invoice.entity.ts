import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { BaseEntity } from 'src/common/entities/base.entity';

import { Order } from '../../orders/entities/order.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { Customer } from '../../customers/entities/customer.entity';

import { InvoiceStatus } from '../enums/invoice-status.enum';
import { InvoiceItem } from './invoice-item.entity';

@Entity('invoices')
@Index(['orderId'], { unique: true })
@Index(['customerId'])
@Index(['paymentId'])
@Index(['status'])
export class Invoice extends BaseEntity {
  @Column({
    name: 'invoice_number',
    type: 'varchar',
    length: 30,
    unique: true,
  })
  invoiceNumber!: string;

  @Column({
    name: 'order_id',
    type: 'uuid',
  })
  orderId!: string;

  @ManyToOne(() => Order, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'order_id' })
  order!: Order;

  @Column({
    name: 'payment_id',
    type: 'uuid',
  })
  paymentId!: string;

  @ManyToOne(() => Payment, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'payment_id' })
  payment!: Payment;

  @Column({
    name: 'customer_id',
    type: 'uuid',
  })
  customerId!: string;

  @ManyToOne(() => Customer, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'customer_id' })
  customer!: Customer;

  // Customer snapshot at invoice creation time
  @Column({
    name: 'customer_name',
    type: 'varchar',
    length: 201,
  })
  customerName!: string;

  @Column({
    name: 'customer_email',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  customerEmail!: string | null;

  @Column({
    name: 'customer_phone',
    type: 'varchar',
    length: 20,
  })
  customerPhone!: string;

  @Column({
    name: 'customer_address',
    type: 'text',
    nullable: true,
  })
  customerAddress!: string | null;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
  })
  subtotal!: string;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
  })
  discount!: string;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
  })
  total!: string;

  @Column({
    type: 'varchar',
    length: 3,
    default: 'EGP',
  })
  currency!: string;

  @Column({
    type: 'enum',
    enum: InvoiceStatus,
    default: InvoiceStatus.ISSUED,
  })
  status!: InvoiceStatus;

  @Column({
    name: 'issued_at',
    type: 'timestamptz',
  })
  issuedAt!: Date;

  @OneToMany(() => InvoiceItem, (invoiceItem) => invoiceItem.invoice)
  items!: InvoiceItem[];
}
