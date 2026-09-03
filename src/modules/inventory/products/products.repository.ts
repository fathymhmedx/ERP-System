import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { BaseRepository } from 'src/common/repositories/base.repository';

import { Product } from './entities/product.entity';

@Injectable()
export class ProductsRepository extends BaseRepository<Product> {
  constructor(
    @InjectRepository(Product)
    repository: Repository<Product>,
  ) {
    super(repository);
  }

  async findBySku(sku: string): Promise<Product | null> {
    return this.repository.findOne({
      where: {
        sku: ILike(sku),
      },
    });
  }

  async findByIdWithRelations(id: string): Promise<Product | null> {
    return this.repository.findOne({
      where: {
        id,
      },
      relations: {
        category: true,
        supplier: true,
      },
    });
  }

  async findPaginated(
    page: number,
    limit: number,
    search?: string,
    categoryId?: string,
    supplierId?: string,
  ): Promise<[Product[], number]> {
    const queryBuilder = this.repository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.supplier', 'supplier')
      .orderBy('product.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (search) {
      queryBuilder.andWhere(
        '(product.name ILIKE :search OR product.sku ILIKE :search)',
        {
          search: `%${search}%`,
        },
      );
    }

    if (categoryId) {
      queryBuilder.andWhere('category.id = :categoryId', {
        categoryId,
      });
    }

    if (supplierId) {
      queryBuilder.andWhere('supplier.id = :supplierId', {
        supplierId,
      });
    }

    return queryBuilder.getManyAndCount();
  }
}
