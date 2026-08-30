import { SimpleEmployeeDto } from 'src/common/dto/simple-employee.dto';

export class BonusResponseDto {
  id!: string;
  employee!: SimpleEmployeeDto;
  amount!: string;
  reason!: string;
  date!: Date;
  createdAt!: Date;
  updatedAt!: Date;
}
