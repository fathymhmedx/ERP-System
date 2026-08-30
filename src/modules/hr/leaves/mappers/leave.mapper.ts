import { Leave } from '../entities/leave.entity';
import { LeaveResponseDto } from '../dto';

export class LeaveMapper {
  static toResponseDto(leave: Leave): LeaveResponseDto {
    return {
      id: leave.id,

      employee: {
        id: leave.employee.id,
        employeeNumber: leave.employee.employeeNumber,
        firstName: leave.employee.firstName,
        lastName: leave.employee.lastName,
      },

      startDate: leave.startDate,
      endDate: leave.endDate,

      reason: leave.reason,
      status: leave.status,

      approvedBy: leave.approvedBy
        ? {
            id: leave.approvedBy.id,
            employeeNumber: leave.approvedBy.employeeNumber,
            firstName: leave.approvedBy.firstName,
            lastName: leave.approvedBy.lastName,
          }
        : null,

      rejectedBy: leave.rejectedBy
        ? {
            id: leave.rejectedBy.id,
            employeeNumber: leave.rejectedBy.employeeNumber,
            firstName: leave.rejectedBy.firstName,
            lastName: leave.rejectedBy.lastName,
          }
        : null,

      rejectionReason: leave.rejectionReason,

      createdAt: leave.createdAt,
      updatedAt: leave.updatedAt,
    };
  }

  static toResponseDtos(leaves: Leave[]): LeaveResponseDto[] {
    return leaves.map((leave) => LeaveMapper.toResponseDto(leave));
  }
}
