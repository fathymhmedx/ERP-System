import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { BaseRepository } from 'src/common/repositories/base.repository';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesRepository extends BaseRepository<Category> {
  constructor(
    @InjectRepository(Category)
    repository: Repository<Category>,
  ) {
    super(repository);
  }

  async findByName(name: string): Promise<Category | null> {
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
  ): Promise<[Category[], number]> {
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
