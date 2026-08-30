import { SimpleEmployeeDto } from 'src/common/dto/simple-employee.dto';
import { AttendanceStatus } from '../enums/attendance-status.enum';

export class AttendanceResponseDto {
  id!: string;

  employee!: SimpleEmployeeDto;

  date!: Date;

  checkIn!: Date;

  checkOut!: Date | null;

  status!: AttendanceStatus;

  createdAt!: Date;

  updatedAt!: Date;
}
