import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { BaseRepository } from 'src/common/repositories/base.repository';

import { Bonus } from '../entities/bonus.entity';
import { BonusQueryDto } from '../dto';
import { AggregateResult } from '../interfaces/aggregate-result.interface';

@Injectable()
export class BonusRepository extends BaseRepository<Bonus> {
  constructor(
    @InjectRepository(Bonus)
    repository: Repository<Bonus>,
  ) {
    super(repository);
  }

  async findAllWithFilters(query: BonusQueryDto): Promise<[Bonus[], number]> {
    const { page, limit, employeeId, year, month } = query;

    const queryBuilder = this.repository
      .createQueryBuilder('bonus')
      .leftJoinAndSelect('bonus.employee', 'employee');

    if (employeeId) {
      queryBuilder.andWhere('employee.id = :employeeId', {
        employeeId,
      });
    }

    if (year) {
      queryBuilder.andWhere('EXTRACT(YEAR FROM bonus.date) = :year', {
        year,
      });
    }

    if (month) {
      queryBuilder.andWhere('EXTRACT(MONTH FROM bonus.date) = :month', {
        month,
      });
    }

    queryBuilder
      .orderBy('bonus.date', 'DESC')
      .addOrderBy('bonus.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    return queryBuilder.getManyAndCount();
  }

  async getTotalForPeriod(
    manager: EntityManager,
    employeeId: string,
    year: number,
    month: number,
  ): Promise<string> {
    const result: AggregateResult | undefined = await manager
      .createQueryBuilder()
      .select('COALESCE(SUM(bonus.amount), 0)', 'total')
      .from(Bonus, 'bonus')
      .where('bonus.employee_id = :employeeId', {
        employeeId,
      })
      .andWhere('EXTRACT(YEAR FROM bonus.date) = :year', {
        year,
      })
      .andWhere('EXTRACT(MONTH FROM bonus.date) = :month', {
        month,
      })
      .andWhere('bonus.deleted_at IS NULL')
      .getRawOne<AggregateResult>();

    return result?.total ?? '0';
  }
}
