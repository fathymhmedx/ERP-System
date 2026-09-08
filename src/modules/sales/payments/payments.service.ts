import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import Decimal from 'decimal.js';
import { DataSource, QueryFailedError } from 'typeorm';

import { OrdersRepository } from '../orders/repositories/orders.repository';
import { OrderStatus } from '../orders/enums/order-status.enum';

import { Payment } from './entities/payment.entity';
import { PaymentProvider } from './enums/payment-provider.enum';
import { PaymentStatus } from './enums/payment-status.enum';
import { PaymentMapper } from './mappers/payment.mapper';
import { PaymentsRepository } from './payments.repository';
import { PaymobProvider } from './providers/paymob/paymob.provider';
import {
  CreatePaymentDto,
  PaymentResponseDto,
  PaymobTransactionWebhookDto,
} from './dto';
import { Order } from '../orders/entities/order.entity';
import { PaymobHmacService } from './providers/paymob/paymob-hmac.service';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly paymentsRepository: PaymentsRepository,
    private readonly ordersRepository: OrdersRepository,
    private readonly paymobProvider: PaymobProvider,
    private readonly paymobHmacService: PaymobHmacService,
  ) {}

  async create(
    dto: CreatePaymentDto,
    idempotencyKey: string,
  ): Promise<PaymentResponseDto> {
    const normalizedIdempotencyKey = idempotencyKey?.trim();

    this.validateIdempotencyKey(normalizedIdempotencyKey);

    const existingPayment = await this.paymentsRepository.findByIdempotencyKey(
      normalizedIdempotencyKey,
    );

    if (existingPayment) {
      this.validateIdempotencyReuse(existingPayment, dto);

      return PaymentMapper.toResponseDto(existingPayment);
    }

    let payment: Payment;
    let customerInfo:
      | { firstName: string; lastName: string; email?: string; phone?: string }
      | undefined;

    try {
      payment = await this.dataSource.transaction(async (manager) => {
        // Pessimistic locking to prevent concurrent payment creation for the same order
        const order = await this.ordersRepository.findByIdForUpdateWithCustomer(
          dto.orderId,
          manager,
        );

        if (!order) {
          throw new NotFoundException('Order not found');
        }

        if (order.status !== OrderStatus.CONFIRMED) {
          throw new BadRequestException(
            'Payment can only be created for confirmed orders',
          );
        }

        if (order.customer) {
          customerInfo = {
            firstName: order.customer.firstName,
            lastName: order.customer.lastName,
            email: order.customer.email ?? undefined,
            phone: order.customer.phone,
          };
        }

        const amount = new Decimal(order.total);

        if (!amount.isFinite() || amount.lte(0)) {
          throw new BadRequestException(
            'Order total must be greater than zero',
          );
        }

        return this.paymentsRepository.createAndSave(manager, {
          orderId: order.id,
          amount: amount.toFixed(2),
          currency: 'EGP',
          provider: PaymentProvider.PAYMOB,
          method: dto.method,
          status: PaymentStatus.PENDING,
          idempotencyKey: normalizedIdempotencyKey,
        });
      });
    } catch (error) {
      if (this.isIdempotencyUniqueViolation(error)) {
        const racedPayment = await this.paymentsRepository.findByIdempotencyKey(
          normalizedIdempotencyKey,
        );

        if (!racedPayment) {
          throw error;
        }

        this.validateIdempotencyReuse(racedPayment, dto);

        return PaymentMapper.toResponseDto(racedPayment);
      }

      throw error;
    }

    try {
      const paymobResult = await this.paymobProvider.createPaymentIntent({
        paymentId: payment.id,
        orderId: payment.orderId,
        amount: payment.amount,
        currency: payment.currency,
        method: payment.method,
        customer: customerInfo,
      });

      await this.paymentsRepository.updateProviderData(payment.id, {
        providerIntentionId: paymobResult.intentionId,
        providerOrderId: paymobResult.providerOrderId,
        providerClientSecret: paymobResult.clientSecret,
      });

      payment.providerIntentionId = paymobResult.intentionId;
      payment.providerOrderId = paymobResult.providerOrderId;
      payment.providerClientSecret = paymobResult.clientSecret;
      payment.failureReason = null;
    } catch (error) {
      const failureReason = this.getPaymobFailureReason(error);

      await this.paymentsRepository.update(
        { id: payment.id },
        { failureReason },
      );

      payment.failureReason = failureReason;

      this.logger.error(
        `Failed to create Paymob intention for payment ${payment.id}. Payment remains PENDING.`,
        error instanceof Error ? error.stack : String(error),
      );
    }

    return PaymentMapper.toResponseDto(payment);
  }

  async handleWebhook(
    dto: PaymobTransactionWebhookDto,
    hmac: string,
  ): Promise<void> {
    this.paymobHmacService.verifyTransaction(dto.obj, hmac);

    const transaction = dto.obj;

    this.paymobHmacService.validateIntegration(transaction.integration_id);

    const paymentId = transaction.order.merchant_order_id;

    if (!paymentId) {
      throw new BadRequestException('Paymob merchant order ID is missing');
    }

    // Pessimistic locking to prevent concurrent updates to the same payment
    await this.dataSource.transaction(async (manager) => {
      const payment = await this.paymentsRepository.findByIdForUpdate(
        paymentId,
        manager,
      );

      if (!payment) {
        throw new NotFoundException('Payment not found');
      }

      if (payment.provider !== PaymentProvider.PAYMOB) {
        throw new BadRequestException('Payment provider mismatch');
      }

      const order = await this.ordersRepository.findByIdForUpdate(
        payment.orderId,
        manager,
      );

      if (!order) {
        throw new NotFoundException('Order not found');
      }

      const callbackAmount = new Decimal(transaction.amount_cents)
        .div(100)
        .toFixed(2);

      if (payment.amount !== callbackAmount) {
        throw new BadRequestException(
          'Paymob transaction amount does not match payment amount',
        );
      }

      if (payment.currency !== transaction.currency) {
        throw new BadRequestException(
          'Paymob transaction currency does not match payment currency',
        );
      }

      const providerTransactionId = String(transaction.id);

      const existingTransaction =
        await this.paymentsRepository.findByProviderTransactionIdForUpdate(
          providerTransactionId,
          manager,
        );

      if (existingTransaction && existingTransaction.id !== payment.id) {
        throw new ConflictException(
          'Paymob transaction is already associated with another payment',
        );
      }

      if (payment.status === PaymentStatus.PAID) {
        return;
      }

      if (payment.status === PaymentStatus.REFUNDED) {
        return;
      }

      if (payment.status === PaymentStatus.FAILED && !transaction.success) {
        return;
      }

      payment.providerTransactionId = providerTransactionId;

      if (transaction.success) {
        if (order.status === OrderStatus.CANCELLED) {
          throw new ConflictException('Cannot complete a cancelled order');
        }

        payment.status = PaymentStatus.PAID;
        payment.paidAt = transaction.paid_at
          ? new Date(transaction.paid_at)
          : new Date();
        payment.failureReason = null;

        await manager.getRepository(Payment).save(payment);

        if (order.status === OrderStatus.CONFIRMED) {
          order.status = OrderStatus.COMPLETED;

          await manager.getRepository(Order).save(order);
        }

        return;
      }

      payment.status = PaymentStatus.FAILED;
      payment.failureReason = 'Paymob transaction failed';

      await manager.getRepository(Payment).save(payment);
    });
  }

  private validateIdempotencyKey(idempotencyKey: string): void {
    if (!idempotencyKey) {
      throw new BadRequestException('Idempotency-Key header is required');
    }

    if (idempotencyKey.length > 100) {
      throw new BadRequestException(
        'Idempotency-Key must not exceed 100 characters',
      );
    }
  }

  private validateIdempotencyReuse(
    payment: Payment,
    dto: CreatePaymentDto,
  ): void {
    if (payment.orderId !== dto.orderId || payment.method !== dto.method) {
      throw new ConflictException(
        'Idempotency-Key was already used for a different payment request',
      );
    }
  }

  private isIdempotencyUniqueViolation(error: unknown): boolean {
    if (!(error instanceof QueryFailedError)) {
      return false;
    }

    const driverError = error.driverError as {
      code?: string;
      constraint?: string;
    };

    return (
      driverError.code === '23505' &&
      driverError.constraint === 'UQ_payments_idempotency_key'
    );
  }

  private getPaymobFailureReason(error: unknown): string {
    if (error instanceof Error) {
      return error.message.slice(0, 500);
    }

    return 'Failed to create Paymob payment intention';
  }
}
