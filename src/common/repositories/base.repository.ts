import {
  Repository,
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  QueryDeepPartialEntity,
} from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';

export abstract class BaseRepository<T extends BaseEntity> {
  constructor(protected readonly repository: Repository<T>) {}

  create(data: DeepPartial<T>): T {
    return this.repository.create(data);
  }

  async save(entity: DeepPartial<T>): Promise<T> {
    return this.repository.save(entity);
  }

  async find(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  async findOne(options: FindOneOptions<T>): Promise<T | null> {
    return this.repository.findOne(options);
  }

  async findOneBy(where: FindOptionsWhere<T>): Promise<T | null> {
    return this.repository.findOneBy(where);
  }

  async findById(
    id: string,
    options?: Omit<FindOneOptions<T>, 'where'>,
  ): Promise<T | null> {
    return this.repository.findOne({
      where: {
        id,
      } as FindOptionsWhere<T>,
      ...options,
    });
  }

  async exists(where: FindOptionsWhere<T>): Promise<boolean> {
    return this.repository.existsBy(where);
  }

  async update(
    where: FindOptionsWhere<T>,
    data: QueryDeepPartialEntity<T>,
  ): Promise<void> {
    await this.repository.update(where, data);
  }

  merge(entity: T, data: DeepPartial<T>): T {
    return this.repository.merge(entity, data);
  }

  async preload(data: DeepPartial<T>): Promise<T | undefined> {
    return this.repository.preload(data);
  }

  async delete(where: FindOptionsWhere<T>): Promise<void> {
    await this.repository.delete(where);
  }

  async softDelete(where: FindOptionsWhere<T>): Promise<void> {
    await this.repository.softDelete(where);
  }

  async restore(where: FindOptionsWhere<T>): Promise<void> {
    await this.repository.restore(where);
  }

  async count(where?: FindOptionsWhere<T>): Promise<number> {
    return this.repository.count({ where });
  }
}
