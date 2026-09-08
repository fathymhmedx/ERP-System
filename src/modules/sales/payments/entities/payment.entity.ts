import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from 'src/common/entities/base.entity';

import { Order } from '../../orders/entities/order.entity';

import { PaymentProvider } from '../enums/payment-provider.enum';
import { PaymentStatus } from '../enums/payment-status.enum';
import { PaymentMethod } from '../enums/payment-method.enum';

@Entity('payments')
@Index(['orderId'])
@Index(['status'])
@Index(['provider'])
export class Payment extends BaseEntity {
  @Column({ name: 'order_id', type: 'uuid' })
  orderId!: string;

  @ManyToOne(() => Order, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'order_id' })
  order!: Order;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
  })
  amount!: string;

  @Column({
    type: 'varchar',
    length: 3,
    default: 'EGP',
  })
  currency!: string;

  @Column({
    type: 'enum',
    enum: PaymentProvider,
  })
  provider!: PaymentProvider;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
  })
  method!: PaymentMethod;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status!: PaymentStatus;

  @Column({
    name: 'provider_intention_id',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  providerIntentionId!: string | null;

  @Column({
    name: 'provider_order_id',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  providerOrderId!: string | null;

  @Column({
    name: 'provider_transaction_id',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  providerTransactionId!: string | null;

  @Column({
    name: 'provider_client_secret',
    type: 'text',
    nullable: true,
  })
  providerClientSecret!: string | null;

  @Column({
    name: 'paid_at',
    type: 'timestamptz',
    nullable: true,
  })
  paidAt!: Date | null;

  @Column({
    name: 'failure_reason',
    type: 'text',
    nullable: true,
  })
  failureReason!: string | null;

  @Column({
    name: 'idempotency_key',
    type: 'varchar',
    length: 100,
  })
  idempotencyKey!: string;
}
