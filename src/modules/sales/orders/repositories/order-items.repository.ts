import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, EntityManager, Repository } from 'typeorm';

import { BaseRepository } from 'src/common/repositories/base.repository';

import { OrderItem } from '../entities/order-item.entity';

@Injectable()
export class OrderItemsRepository extends BaseRepository<OrderItem> {
  constructor(
    @InjectRepository(OrderItem)
    repository: Repository<OrderItem>,
  ) {
    super(repository);
  }

  async createAndSaveMany(
    manager: EntityManager,
    data: DeepPartial<OrderItem>[],
  ): Promise<OrderItem[]> {
    const repository = manager.getRepository(OrderItem);

    const orderItems = repository.create(data);

    return repository.save(orderItems);
  }

  async createAndSave(
    manager: EntityManager,
    data: DeepPartial<OrderItem>,
  ): Promise<OrderItem> {
    const repository = manager.getRepository(OrderItem);

    const orderItem = repository.create(data);

    return repository.save(orderItem);
  }

  async findByOrderAndProduct(
    orderId: string,
    productId: string,
    manager?: EntityManager,
  ): Promise<OrderItem | null> {
    const repository = manager
      ? manager.getRepository(OrderItem)
      : this.repository;

    return repository.findOne({
      where: {
        orderId,
        productId,
      },
    });
  }

  async findByIdAndOrderId(
    id: string,
    orderId: string,
    manager?: EntityManager,
  ): Promise<OrderItem | null> {
    const repository = manager
      ? manager.getRepository(OrderItem)
      : this.repository;

    return repository.findOne({
      where: {
        id,
        orderId,
      },
    });
  }
}
