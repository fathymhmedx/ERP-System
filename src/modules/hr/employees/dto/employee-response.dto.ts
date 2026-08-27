import { SimpleDepartmentDto } from 'src/common/dto/simple-department.dto';
import { SimplePositionDto } from 'src/common/dto/simple-position.dto';
import { SimpleEmployeeDto } from 'src/common/dto/simple-employee.dto';
import { SimpleUserDto } from 'src/common/dto/simple-user.dto';

export class EmployeeResponseDto {
  id!: string;

  employeeNumber!: string;

  firstName!: string;

  lastName!: string;

  phone!: string | null;

  address!: string | null;

  dateOfBirth!: Date | null;

  hireDate!: Date;

  employmentStatus!: string;

  user!: SimpleUserDto | null;

  department!: SimpleDepartmentDto | null;

  position!: SimplePositionDto | null;

  manager!: SimpleEmployeeDto | null;

  createdAt!: Date;

  updatedAt!: Date;
}
