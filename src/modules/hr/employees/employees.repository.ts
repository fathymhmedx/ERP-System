import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseRepository } from 'src/common/repositories/base.repository';

import { Employee } from './entities/employee.entity';
import { GetEmployeesQueryDto } from './dto';

@Injectable()
export class EmployeesRepository extends BaseRepository<Employee> {
  constructor(
    @InjectRepository(Employee)
    repository: Repository<Employee>,
  ) {
    super(repository);
  }

  /**
   * Find employee by employee number.
   */
  async findByEmployeeNumber(employeeNumber: string): Promise<Employee | null> {
    return this.findOne({
      where: {
        employeeNumber,
      },
    });
  }

  /**
   * Find employee by id with all required relations.
   */
  async findByIdWithRelations(id: string): Promise<Employee | null> {
    return this.findById(id, {
      relations: {
        user: true,
        department: true,
        position: true,
        manager: true,
      },
    });
  }

  /**
   * Find employee by user id.
   */
  async findByUserId(userId: string): Promise<Employee | null> {
    return this.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  /**
   * Find employees with pagination, search and filters.
   */
  async findAllWithRelations(
    query: GetEmployeesQueryDto,
  ): Promise<[Employee[], number]> {
    const { page, limit, search, departmentId, positionId, employmentStatus } =
      query;

    const queryBuilder = this.repository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.user', 'user')
      .leftJoinAndSelect('employee.department', 'department')
      .leftJoinAndSelect('employee.position', 'position')
      .leftJoinAndSelect('employee.manager', 'manager');

    if (search) {
      queryBuilder.andWhere(
        `(
          employee.employeeNumber ILIKE :search
          OR employee.firstName ILIKE :search
          OR employee.lastName ILIKE :search
          OR user.email ILIKE :search
        )`,
        {
          search: `%${search}%`,
        },
      );
    }

    if (departmentId) {
      queryBuilder.andWhere('department.id = :departmentId', {
        departmentId,
      });
    }

    if (positionId) {
      queryBuilder.andWhere('position.id = :positionId', {
        positionId,
      });
    }

    if (employmentStatus) {
      queryBuilder.andWhere('employee.employmentStatus = :employmentStatus', {
        employmentStatus,
      });
    }

    queryBuilder
      .orderBy('employee.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    return queryBuilder.getManyAndCount();
  }
}
