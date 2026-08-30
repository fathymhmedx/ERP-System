import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseRepository } from 'src/common/repositories/base.repository';
import { Attendance } from './entities/attendance.entity';
import {
  AttendanceQueryDto,
  MonthlyReportQueryDto,
  MonthlyReportResponseDto,
} from './dto';
import { AttendanceStatus } from './enums/attendance-status.enum';

export class AttendanceRepository extends BaseRepository<Attendance> {
  constructor(
    @InjectRepository(Attendance)
    repository: Repository<Attendance>,
  ) {
    super(repository);
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  async findByEmployeeAndDate(
    employeeId: string,
    date: Date,
  ): Promise<Attendance | null> {
    const formattedDate = this.formatDate(date);

    return this.repository
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.employee', 'employee')
      .where('employee.id = :employeeId', { employeeId })
      .andWhere('attendance.date = :date', {
        date: formattedDate,
      })
      .getOne();
  }

  async findAllWithFilters(
    query: AttendanceQueryDto,
  ): Promise<[Attendance[], number]> {
    const { page, limit, employeeId, startDate, endDate, status } = query;

    const queryBuilder = this.repository
      .createQueryBuilder('attendance')
      .leftJoinAndSelect('attendance.employee', 'employee');

    if (employeeId) {
      queryBuilder.andWhere('employee.id = :employeeId', { employeeId });
    }

    if (startDate) {
      queryBuilder.andWhere('attendance.date >= :startDate', {
        startDate: this.formatDate(startDate),
      });
    }

    if (endDate) {
      queryBuilder.andWhere('attendance.date <= :endDate', {
        endDate: this.formatDate(endDate),
      });
    }

    if (status) {
      queryBuilder.andWhere('attendance.status = :status', { status });
    }

    queryBuilder
      .orderBy('attendance.date', 'DESC')
      .addOrderBy('attendance.checkIn', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    return queryBuilder.getManyAndCount();
  }

  async getMonthlyReport(
    query: MonthlyReportQueryDto,
  ): Promise<MonthlyReportResponseDto> {
    const { employeeId, year, month } = query;

    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;

    const lastDay = new Date(year, month, 0).getDate();

    const endDate = `${year}-${String(month).padStart(2, '0')}-${String(
      lastDay,
    ).padStart(2, '0')}`;

    const result = await this.repository
      .createQueryBuilder('attendance')
      .select('COUNT(*)', 'totalAttendanceDays')
      .addSelect(
        `COUNT(*) FILTER (
      WHERE attendance.status = :presentStatus
    )`,
        'presentDays',
      )
      .addSelect(
        `COUNT(*) FILTER (
      WHERE attendance.status = :lateStatus
    )`,
        'lateDays',
      )
      .addSelect(
        `COUNT(*) FILTER (
      WHERE attendance.status = :absentStatus
    )`,
        'absentDays',
      )
      .addSelect(
        `COUNT(*) FILTER (
      WHERE attendance.status = :leaveStatus
    )`,
        'leaveDays',
      )
      .addSelect(
        `COALESCE(
      SUM(
        EXTRACT(
          EPOCH FROM (
            attendance."checkOut" - attendance."checkIn"
          )
        ) / 3600
      ) FILTER (
        WHERE attendance."checkIn" IS NOT NULL
          AND attendance."checkOut" IS NOT NULL
      ),
      0
    )`,
        'totalWorkingHours',
      )
      .where('attendance.employee_id = :employeeId', {
        employeeId,
      })
      .andWhere('attendance.date >= :startDate', {
        startDate,
      })
      .andWhere('attendance.date <= :endDate', {
        endDate,
      })
      .setParameters({
        presentStatus: AttendanceStatus.PRESENT,
        lateStatus: AttendanceStatus.LATE,
        absentStatus: AttendanceStatus.ABSENT,
        leaveStatus: AttendanceStatus.ON_LEAVE,
      })
      .getRawOne<{
        totalAttendanceDays: string;
        presentDays: string;
        lateDays: string;
        absentDays: string;
        leaveDays: string;
        totalWorkingHours: string;
      }>();

    if (!result) {
      throw new Error('Failed to generate attendance report');
    }

    return {
      employeeId,
      year,
      month,
      totalAttendanceDays: Number(result.totalAttendanceDays),
      presentDays: Number(result.presentDays),
      lateDays: Number(result.lateDays),
      absentDays: Number(result.absentDays),
      leaveDays: Number(result.leaveDays),
      totalWorkingHours: Number(Number(result.totalWorkingHours).toFixed(2)),
    };
  }
}
