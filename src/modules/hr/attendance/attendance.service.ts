import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { EmployeesRepository } from '../employees/employees.repository';
import { AttendanceRepository } from './attendance.repository';
import { AttendanceMapper } from './mappers/attendance.mapper';
import { AttendanceStatus } from './enums/attendance-status.enum';

import {
  AttendanceQueryDto,
  AttendanceResponseDto,
  MonthlyReportQueryDto,
  MonthlyReportResponseDto,
} from './dto';

import { PaginatedResponse } from 'src/common/interfaces/pagination/paginated-response.interface';
import { QueryFailedError } from 'typeorm';

@Injectable()
export class AttendanceService {
  constructor(
    private readonly attendanceRepository: AttendanceRepository,
    private readonly employeesRepository: EmployeesRepository,
  ) {}

  async checkIn(userId: string): Promise<AttendanceResponseDto> {
    const employee = await this.employeesRepository.findByUserId(userId);

    if (!employee) {
      throw new NotFoundException('Employee profile not found for this user');
    }

    const now = new Date();

    const existingAttendance =
      await this.attendanceRepository.findByEmployeeAndDate(employee.id, now);

    if (existingAttendance) {
      throw new ConflictException('Already checked in for today');
    }

    const attendance = this.attendanceRepository.create({
      employee,
      date: now,
      checkIn: now,
      status: AttendanceStatus.PRESENT,
    });

    try {
      const savedAttendance = await this.attendanceRepository.save(attendance);

      return AttendanceMapper.toResponseDto(savedAttendance);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error as { driverError?: { code?: string } }).driverError?.code ===
          '23505'
      ) {
        throw new ConflictException('Already checked in for today');
      }

      throw error;
    }
  }

  async checkOut(userId: string): Promise<AttendanceResponseDto> {
    const employee = await this.employeesRepository.findByUserId(userId);

    if (!employee) {
      throw new NotFoundException('Employee profile not found for this user');
    }

    const now = new Date();

    const attendance = await this.attendanceRepository.findByEmployeeAndDate(
      employee.id,
      now,
    );

    if (!attendance) {
      throw new NotFoundException('No check-in record found for today');
    }

    if (attendance.checkOut) {
      throw new ConflictException('Already checked out for today');
    }

    if (now < attendance.checkIn) {
      throw new BadRequestException(
        'Check-out time cannot be before check-in time',
      );
    }

    attendance.checkOut = now;

    const savedAttendance = await this.attendanceRepository.save(attendance);

    return AttendanceMapper.toResponseDto(savedAttendance);
  }

  async findAll(
    query: AttendanceQueryDto,
  ): Promise<PaginatedResponse<AttendanceResponseDto>> {
    const [attendances, total] =
      await this.attendanceRepository.findAllWithFilters(query);

    return {
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
      data: AttendanceMapper.toResponseDtos(attendances),
    };
  }

  async findByEmployee(
    employeeId: string,
    query: AttendanceQueryDto,
  ): Promise<PaginatedResponse<AttendanceResponseDto>> {
    const employee = await this.employeesRepository.findById(employeeId);

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    return this.findAll({
      ...query,
      employeeId,
    });
  }

  async getMonthlyReport(
    query: MonthlyReportQueryDto,
  ): Promise<MonthlyReportResponseDto> {
    const employee = await this.employeesRepository.findById(query.employeeId);

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return this.attendanceRepository.getMonthlyReport(query);
  }
}
