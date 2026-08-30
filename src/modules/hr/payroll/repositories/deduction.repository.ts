import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { BaseRepository } from 'src/common/repositories/base.repository';

import { Deduction } from '../entities/deduction.entity';
import { DeductionQueryDto } from '../dto';
import { AggregateResult } from '../interfaces/aggregate-result.interface';

@Injectable()
export class DeductionRepository extends BaseRepository<Deduction> {
  constructor(
    @InjectRepository(Deduction)
    repository: Repository<Deduction>,
  ) {
    super(repository);
  }

  async findAllWithFilters(
    query: DeductionQueryDto,
  ): Promise<[Deduction[], number]> {
    const { page, limit, employeeId, year, month } = query;

    const queryBuilder = this.repository
      .createQueryBuilder('deduction')
      .leftJoinAndSelect('deduction.employee', 'employee');

    if (employeeId) {
      queryBuilder.andWhere('employee.id = :employeeId', {
        employeeId,
      });
    }

    if (year) {
      queryBuilder.andWhere('EXTRACT(YEAR FROM deduction.date) = :year', {
        year,
      });
    }

    if (month) {
      queryBuilder.andWhere('EXTRACT(MONTH FROM deduction.date) = :month', {
        month,
      });
    }

    queryBuilder
      .orderBy('deduction.date', 'DESC')
      .addOrderBy('deduction.createdAt', 'DESC')
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
      .select('COALESCE(SUM(deduction.amount), 0)', 'total')
      .from(Deduction, 'deduction')
      .where('deduction.employee_id = :employeeId', {
        employeeId,
      })
      .andWhere('EXTRACT(YEAR FROM deduction.date) = :year', {
        year,
      })
      .andWhere('EXTRACT(MONTH FROM deduction.date) = :month', {
        month,
      })
      .andWhere('deduction.deleted_at IS NULL')
      .getRawOne<AggregateResult>();

    return result?.total ?? '0';
  }
}
