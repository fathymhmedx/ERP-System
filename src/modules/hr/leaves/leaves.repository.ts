import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseRepository } from 'src/common/repositories/base.repository';
import { Leave } from './entities/leave.entity';
import { LeaveQueryDto } from './dto';
import { LeaveStatus } from './enums/leave-status.enum';

@Injectable()
export class LeavesRepository extends BaseRepository<Leave> {
  constructor(
    @InjectRepository(Leave)
    repository: Repository<Leave>,
  ) {
    super(repository);
  }

  async findByIdWithRelations(id: string): Promise<Leave | null> {
    return this.findById(id, {
      relations: {
        employee: true,
        approvedBy: true,
        rejectedBy: true,
      },
    });
  }

  /**
   * Find an active leave request that overlaps
   * with the given date range.
   *
   * Used as an application-level check.
   * The database exclusion constraint is the
   * final protection against race conditions.
   */
  async findOverlappingLeave(
    employeeId: string,
    startDate: string,
    endDate: string,
    excludeStatuses: LeaveStatus[],
  ): Promise<Leave | null> {
    return this.repository
      .createQueryBuilder('leave')
      .where('leave.employee_id = :employeeId', {
        employeeId,
      })
      .andWhere('leave.status NOT IN (:...excludeStatuses)', {
        excludeStatuses,
      })
      .andWhere('leave.startDate <= :endDate AND leave.endDate >= :startDate', {
        startDate,
        endDate,
      })
      .getOne();
  }

  async findAllWithFilters(query: LeaveQueryDto): Promise<[Leave[], number]> {
    const { page, limit, search, employeeId, status, startDate, endDate } =
      query;

    const queryBuilder = this.repository
      .createQueryBuilder('leave')
      .leftJoinAndSelect('leave.employee', 'employee')
      .leftJoinAndSelect('leave.approvedBy', 'approvedBy')
      .leftJoinAndSelect('leave.rejectedBy', 'rejectedBy');

    if (search) {
      queryBuilder.andWhere(
        `(
          employee.firstName ILIKE :search
          OR employee.lastName ILIKE :search
          OR employee.employeeNumber ILIKE :search
          OR leave.reason ILIKE :search
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

    if (status) {
      queryBuilder.andWhere('leave.status = :status', {
        status,
      });
    }

    if (startDate) {
      queryBuilder.andWhere('leave.startDate >= :startDate', {
        startDate,
      });
    }

    if (endDate) {
      queryBuilder.andWhere('leave.endDate <= :endDate', {
        endDate,
      });
    }

    queryBuilder
      .orderBy('leave.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    return queryBuilder.getManyAndCount();
  }
}
