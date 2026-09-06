import { Injectable } from '@nestjs/common';

import { BaseRepository } from 'src/common/repositories/base.repository';

import { Customer } from './entities/customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class CustomersRepository extends BaseRepository<Customer> {
  constructor(
    @InjectRepository(Customer)
    repository: Repository<Customer>,
  ) {
    super(repository);
  }

  async findByEmail(email: string): Promise<Customer | null> {
    return this.repository.findOne({
      where: {
        email: ILike(email),
      },
    });
  }

  async findPaginated(
    page: number,
    limit: number,
    search?: string,
    phone?: string,
  ): Promise<[Customer[], number]> {
    const queryBuilder = this.repository
      .createQueryBuilder('customer')
      .orderBy('customer.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (search) {
      queryBuilder.andWhere(
        `(
        customer.first_name ILIKE :search
        OR customer.last_name ILIKE :search
        OR customer.email ILIKE :search
      )`,
        {
          search: `%${search}%`,
        },
      );
    }

    if (phone) {
      queryBuilder.andWhere('customer.phone = :phone', {
        phone,
      });
    }

    return queryBuilder.getManyAndCount();
  }
}
