import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { BaseRepository } from 'src/common/repositories/base.repository';

import { Supplier } from './entities/supplier.entity';

@Injectable()
export class SuppliersRepository extends BaseRepository<Supplier> {
  constructor(
    @InjectRepository(Supplier)
    repository: Repository<Supplier>,
  ) {
    super(repository);
  }

  async findByName(name: string): Promise<Supplier | null> {
    return this.repository.findOne({
      where: {
        name: ILike(name),
      },
    });
  }

  async findPaginated(
    page: number,
    limit: number,
    search?: string,
  ): Promise<[Supplier[], number]> {
    return this.repository.findAndCount({
      where: search
        ? {
            name: ILike(`%${search}%`),
          }
        : undefined,
      order: {
        createdAt: 'DESC',
      },
      skip: (page - 1) * limit,
      take: limit,
    });
  }
}
