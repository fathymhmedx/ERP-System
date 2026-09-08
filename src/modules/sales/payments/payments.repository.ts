import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, EntityManager, Repository } from 'typeorm';

import { BaseRepository } from 'src/common/repositories/base.repository';

import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentsRepository extends BaseRepository<Payment> {
  constructor(
    @InjectRepository(Payment)
    repository: Repository<Payment>,
  ) {
    super(repository);
  }

  async createAndSave(
    manager: EntityManager,
    data: DeepPartial<Payment>,
  ): Promise<Payment> {
    const repository = manager.getRepository(Payment);

    const payment = repository.create(data);

    return repository.save(payment);
  }

  async findByOrderId(orderId: string): Promise<Payment[]> {
    return this.repository.find({
      where: {
        orderId,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findByProviderTransactionId(
    providerTransactionId: string,
  ): Promise<Payment | null> {
    return this.repository.findOne({
      where: {
        providerTransactionId,
      },
    });
  }

  async findByProviderIntentionId(
    providerIntentionId: string,
  ): Promise<Payment | null> {
    return this.repository.findOne({
      where: {
        providerIntentionId,
      },
    });
  }

  async updateProviderData(
    paymentId: string,
    data: {
      providerIntentionId: string;
      providerOrderId: string;
      providerClientSecret: string;
    },
  ): Promise<void> {
    await this.repository.update({ id: paymentId }, data);
  }

  async findByIdempotencyKey(
    idempotencyKey: string,
    manager?: EntityManager,
  ): Promise<Payment | null> {
    const repository = manager
      ? manager.getRepository(Payment)
      : this.repository;

    return repository.findOne({
      where: {
        idempotencyKey,
      },
    });
  }

  async findByIdForUpdate(
    id: string,
    manager: EntityManager,
  ): Promise<Payment | null> {
    return manager
      .getRepository(Payment)
      .createQueryBuilder('payment')
      .setLock('pessimistic_write')
      .where('payment.id = :id', { id })
      .getOne();
  }

  async findByProviderTransactionIdForUpdate(
    providerTransactionId: string,
    manager: EntityManager,
  ): Promise<Payment | null> {
    return manager
      .getRepository(Payment)
      .createQueryBuilder('payment')
      .setLock('pessimistic_write')
      .where('payment.provider_transaction_id = :providerTransactionId', {
        providerTransactionId,
      })
      .getOne();
  }
}
