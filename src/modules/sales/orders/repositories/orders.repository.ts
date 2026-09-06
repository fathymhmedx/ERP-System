import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, EntityManager, Repository } from 'typeorm';

import { BaseRepository } from 'src/common/repositories/base.repository';

import { Order } from '../entities/order.entity';
import { OrderStatus } from '../enums/order-status.enum';

@Injectable()
export class OrdersRepository extends BaseRepository<Order> {
  constructor(
    @InjectRepository(Order)
    repository: Repository<Order>,
  ) {
    super(repository);
  }

  async findPaginated(
    page: number,
    limit: number,
    customerId?: string,
    status?: OrderStatus,
  ): Promise<[Order[], number]> {
    const queryBuilder = this.repository
      .createQueryBuilder('order')
      .orderBy('order.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (customerId) {
      queryBuilder.andWhere('order.customer_id = :customerId', {
        customerId,
      });
    }

    if (status) {
      queryBuilder.andWhere('order.status = :status', {
        status,
      });
    }

    return queryBuilder.getManyAndCount();
  }

  async findByIdWithCustomerAndItems(
    id: string,
    manager?: EntityManager,
  ): Promise<Order | null> {
    const repository = manager ? manager.getRepository(Order) : this.repository;

    return repository.findOne({
      where: {
        id,
      },
      relations: {
        customer: true,
        items: true,
      },
    });
  }

  async createAndSave(
    manager: EntityManager,
    data: DeepPartial<Order>,
  ): Promise<Order> {
    const repository = manager.getRepository(Order);

    const order = repository.create(data);

    return repository.save(order);
  }

  async getNextOrderNumberSequence(manager: EntityManager): Promise<number> {
    const result = await manager.query<Array<{ sequence: string }>>(
      `SELECT nextval('"orders_number_seq"') AS sequence`,
    );

    return Number(result[0].sequence);
  }

  async findByIdForUpdate(
    id: string,
    manager: EntityManager,
  ): Promise<Order | null> {
    return manager
      .getRepository(Order)
      .createQueryBuilder('order')
      .setLock('pessimistic_write')
      .where('order.id = :id', { id })
      .getOne();
  }

  async findByIdForUpdateWithItems(
    id: string,
    manager: EntityManager,
  ): Promise<Order | null> {
    return manager
      .getRepository(Order)
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .setLock('pessimistic_write')
      .where('order.id = :id', { id })
      .getOne();
  }
}
