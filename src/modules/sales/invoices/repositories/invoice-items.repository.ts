import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, EntityManager, Repository } from 'typeorm';

import { BaseRepository } from 'src/common/repositories/base.repository';

import { InvoiceItem } from '../entities/invoice-item.entity';

@Injectable()
export class InvoiceItemsRepository extends BaseRepository<InvoiceItem> {
  constructor(
    @InjectRepository(InvoiceItem)
    repository: Repository<InvoiceItem>,
  ) {
    super(repository);
  }

  async createAndSave(
    manager: EntityManager,
    data: DeepPartial<InvoiceItem>,
  ): Promise<InvoiceItem> {
    const repository = manager.getRepository(InvoiceItem);

    const invoiceItem = repository.create(data);

    return repository.save(invoiceItem);
  }

  async createAndSaveMany(
    manager: EntityManager,
    data: DeepPartial<InvoiceItem>[],
  ): Promise<InvoiceItem[]> {
    const repository = manager.getRepository(InvoiceItem);

    const invoiceItems = repository.create(data);

    return repository.save(invoiceItems);
  }

  async findByInvoiceId(
    invoiceId: string,
    manager?: EntityManager,
  ): Promise<InvoiceItem[]> {
    const repository = manager
      ? manager.getRepository(InvoiceItem)
      : this.repository;

    return repository.find({
      where: {
        invoiceId,
      },
    });
  }
}
