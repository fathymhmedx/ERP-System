import { SimpleEmployeeDto } from 'src/common/dto/simple-employee.dto';
import { PayrollStatus } from '../../enums/payroll-status.enum';

export class PayrollResponseDto {
  id!: string;
  employee!: SimpleEmployeeDto;
  year!: number;
  month!: number;
  baseSalary!: string;
  totalBonus!: string;
  totalDeduction!: string;
  netSalary!: string;
  status!: PayrollStatus;
  generatedAt!: Date;
  createdAt!: Date;
  updatedAt!: Date;
}
