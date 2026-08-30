import { SimpleEmployeeDto } from 'src/common/dto/simple-employee.dto';

import { LeaveStatus } from '../enums/leave-status.enum';

export class LeaveResponseDto {
  id!: string;

  employee!: SimpleEmployeeDto;

  startDate!: Date;

  endDate!: Date;

  reason!: string;

  status!: LeaveStatus;

  approvedBy!: SimpleEmployeeDto | null;

  rejectedBy!: SimpleEmployeeDto | null;

  rejectionReason!: string | null;

  createdAt!: Date;

  updatedAt!: Date;
}
