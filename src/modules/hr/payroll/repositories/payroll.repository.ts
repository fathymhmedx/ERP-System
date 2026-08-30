import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, EntityManager, Repository } from 'typeorm';

import { BaseRepository } from 'src/common/repositories/base.repository';

import { Payroll } from '../entities/payroll.entity';
import { PayrollQueryDto } from '../dto';

@Injectable()
export class PayrollRepository extends BaseRepository<Payroll> {
  constructor(
    @InjectRepository(Payroll)
    repository: Repository<Payroll>,
  ) {
    super(repository);
  }

  async findAllWithFilters(
    query: PayrollQueryDto,
  ): Promise<[Payroll[], number]> {
    const { page, limit, search, employeeId, year, month, status } = query;

    const queryBuilder = this.repository
      .createQueryBuilder('payroll')
      .leftJoinAndSelect('payroll.employee', 'employee');

    if (search) {
      queryBuilder.andWhere(
        `(
          employee.firstName ILIKE :search
          OR employee.lastName ILIKE :search
          OR employee.employeeNumber ILIKE :search
        )`,
        {
          search: `%${search}%`,
        },
      );
    }

    if (employeeId) {
      queryBuilder.andWhere('employee.id = :employeeId', {
        employeeId,
      });
    }

    if (year) {
      queryBuilder.andWhere('payroll.year = :year', {
        year,
      });
    }

    if (month) {
      queryBuilder.andWhere('payroll.month = :month', {
        month,
      });
    }

    if (status) {
      queryBuilder.andWhere('payroll.status = :status', {
        status,
      });
    }

    queryBuilder
      .orderBy('payroll.year', 'DESC')
      .addOrderBy('payroll.month', 'DESC')
      .addOrderBy('payroll.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    return queryBuilder.getManyAndCount();
  }

  async findByEmployeeAndPeriod(
    employeeId: string,
    year: number,
    month: number,
  ): Promise<Payroll | null> {
    return this.repository.findOne({
      where: {
        employee: {
          id: employeeId,
        },
        year,
        month,
      },
    });
  }

  async createAndSave(
    manager: EntityManager,
    payrollData: DeepPartial<Payroll>,
  ): Promise<Payroll> {
    const payroll = manager.create(Payroll, payrollData);

    return manager.save(Payroll, payroll);
  }

  async findByIdWithEmployee(
    manager: EntityManager,
    id: string,
  ): Promise<Payroll | null> {
    return manager.findOne(Payroll, {
      where: {
        id,
      },
      relations: {
        employee: true,
      },
    });
  }
}
