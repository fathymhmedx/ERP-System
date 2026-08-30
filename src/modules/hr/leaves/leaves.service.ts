import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { EmployeesRepository } from '../employees/employees.repository';
import { LeavesRepository } from './leaves.repository';
import { LeaveMapper } from './mappers/leave.mapper';
import { LeaveStatus } from './enums/leave-status.enum';

import {
  CreateLeaveDto,
  LeaveQueryDto,
  LeaveResponseDto,
  RejectLeaveDto,
} from './dto';

import { PaginatedResponse } from 'src/common/interfaces/pagination/paginated-response.interface';

@Injectable()
export class LeavesService {
  constructor(
    private readonly leavesRepository: LeavesRepository,
    private readonly employeesRepository: EmployeesRepository,
  ) {}

  /**
   * Request a new leave.
   *
   * The overlap check is used for a normal/fast rejection.
   * PostgreSQL exclusion constraint is the final protection
   * against concurrent requests.
   */
  async requestLeave(
    userId: string,
    dto: CreateLeaveDto,
  ): Promise<LeaveResponseDto> {
    const employee = await this.employeesRepository.findByUserId(userId);

    if (!employee) {
      throw new NotFoundException('Employee profile not found for this user');
    }

    const { startDate, endDate, reason } = dto;

    if (endDate < startDate) {
      throw new BadRequestException('End date cannot be before start date');
    }

    const overlappingLeave = await this.leavesRepository.findOverlappingLeave(
      employee.id,
      startDate,
      endDate,
      [LeaveStatus.REJECTED, LeaveStatus.CANCELLED],
    );

    if (overlappingLeave) {
      throw new ConflictException(
        'Leave dates overlap with an existing request',
      );
    }

    const leave = this.leavesRepository.create({
      employee,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
      status: LeaveStatus.PENDING,
    });

    try {
      const savedLeave = await this.leavesRepository.save(leave);

      const leaveWithRelations =
        await this.leavesRepository.findByIdWithRelations(savedLeave.id);

      if (!leaveWithRelations) {
        throw new NotFoundException('Leave request not found');
      }

      return LeaveMapper.toResponseDto(leaveWithRelations);
    } catch (error) {
      /**
       * The application-level overlap check above is NOT enough
       * because two requests can pass it at the same time.
       *
       * PostgreSQL exclusion constraint is the final protection.
       */
      if (
        error instanceof Error &&
        error.message.includes('leaves_no_overlapping_active_leave')
      ) {
        throw new ConflictException(
          'Leave dates overlap with an existing request',
        );
      }

      throw error;
    }
  }

  /**
   * Approve a pending leave request.
   */
  async approveLeave(
    userId: string,
    leaveId: string,
  ): Promise<LeaveResponseDto> {
    const leave = await this.leavesRepository.findByIdWithRelations(leaveId);

    if (!leave) {
      throw new NotFoundException('Leave request not found');
    }

    if (leave.status !== LeaveStatus.PENDING) {
      throw new ConflictException(
        `Cannot approve leave request with status: ${leave.status}`,
      );
    }

    const approver = await this.employeesRepository.findByUserId(userId);

    if (!approver) {
      throw new NotFoundException('Approver employee profile not found');
    }

    leave.status = LeaveStatus.APPROVED;
    leave.approvedBy = approver;

    // Clear rejection information.
    leave.rejectedBy = null;
    leave.rejectionReason = null;

    const savedLeave = await this.leavesRepository.save(leave);

    return LeaveMapper.toResponseDto(savedLeave);
  }

  /**
   * Reject a pending leave request.
   */
  async rejectLeave(
    userId: string,
    leaveId: string,
    dto: RejectLeaveDto,
  ): Promise<LeaveResponseDto> {
    const leave = await this.leavesRepository.findByIdWithRelations(leaveId);

    if (!leave) {
      throw new NotFoundException('Leave request not found');
    }

    if (leave.status !== LeaveStatus.PENDING) {
      throw new ConflictException(
        `Cannot reject leave request with status: ${leave.status}`,
      );
    }

    const rejecter = await this.employeesRepository.findByUserId(userId);

    if (!rejecter) {
      throw new NotFoundException('Rejecting employee profile not found');
    }

    leave.status = LeaveStatus.REJECTED;
    leave.rejectedBy = rejecter;
    leave.rejectionReason = dto.rejectionReason;

    // Clear approval information.
    leave.approvedBy = null;

    const savedLeave = await this.leavesRepository.save(leave);

    return LeaveMapper.toResponseDto(savedLeave);
  }

  /**
   * Cancel the employee's own pending/approved leave.
   */
  async cancelLeave(
    userId: string,
    leaveId: string,
  ): Promise<LeaveResponseDto> {
    const employee = await this.employeesRepository.findByUserId(userId);

    if (!employee) {
      throw new NotFoundException('Employee profile not found for this user');
    }

    const leave = await this.leavesRepository.findByIdWithRelations(leaveId);

    if (!leave) {
      throw new NotFoundException('Leave request not found');
    }

    if (leave.employee.id !== employee.id) {
      throw new ConflictException(
        'You can only cancel your own leave requests',
      );
    }

    if (
      leave.status !== LeaveStatus.PENDING &&
      leave.status !== LeaveStatus.APPROVED
    ) {
      throw new ConflictException(
        `Cannot cancel leave request with status: ${leave.status}`,
      );
    }

    leave.status = LeaveStatus.CANCELLED;

    const savedLeave = await this.leavesRepository.save(leave);

    return LeaveMapper.toResponseDto(savedLeave);
  }

  /**
   * Get paginated leave requests.
   */
  async findAll(
    query: LeaveQueryDto,
  ): Promise<PaginatedResponse<LeaveResponseDto>> {
    const [leaves, total] =
      await this.leavesRepository.findAllWithFilters(query);

    return {
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
      data: LeaveMapper.toResponseDtos(leaves),
    };
  }
}
