import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, EntityManager, Repository } from 'typeorm';

import { BaseRepository } from 'src/common/repositories/base.repository';

import { Invoice } from '../entities/invoice.entity';

@Injectable()
export class InvoicesRepository extends BaseRepository<Invoice> {
  constructor(
    @InjectRepository(Invoice)
    repository: Repository<Invoice>,
  ) {
    super(repository);
  }

  async createAndSave(
    manager: EntityManager,
    data: DeepPartial<Invoice>,
  ): Promise<Invoice> {
    const repository = manager.getRepository(Invoice);

    const invoice = repository.create(data);

    return repository.save(invoice);
  }

  async findByOrderId(
    orderId: string,
    manager?: EntityManager,
  ): Promise<Invoice | null> {
    const repository = manager
      ? manager.getRepository(Invoice)
      : this.repository;

    return repository.findOne({
      where: {
        orderId,
      },
      relations: {
        items: true,
      },
    });
  }

  async findByPaymentId(
    paymentId: string,
    manager?: EntityManager,
  ): Promise<Invoice | null> {
    const repository = manager
      ? manager.getRepository(Invoice)
      : this.repository;

    return repository.findOne({
      where: {
        paymentId,
      },
    });
  }

  async findByIdWithItems(
    id: string,
    manager?: EntityManager,
  ): Promise<Invoice | null> {
    const repository = manager
      ? manager.getRepository(Invoice)
      : this.repository;

    return repository.findOne({
      where: {
        id,
      },
      relations: {
        items: true,
      },
    });
  }

  async getNextInvoiceNumberSequence(manager: EntityManager): Promise<number> {
    const result = await manager.query<Array<{ sequence: string }>>(
      `SELECT nextval('"invoices_number_seq"') AS sequence`,
    );

    return Number(result[0].sequence);
  }
}
