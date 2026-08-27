import { Employee } from '../entities/employee.entity';

import { EmployeeResponseDto } from '../dto';

export class EmployeeMapper {
  static toResponseDto(employee: Employee): EmployeeResponseDto {
    return {
      id: employee.id,
      employeeNumber: employee.employeeNumber,
      firstName: employee.firstName,
      lastName: employee.lastName,
      phone: employee.phone,
      address: employee.address,
      dateOfBirth: employee.dateOfBirth,
      hireDate: employee.hireDate,
      employmentStatus: employee.employmentStatus,

      user: employee.user
        ? {
            id: employee.user.id,
            email: employee.user.email,
          }
        : null,

      department: employee.department
        ? {
            id: employee.department.id,
            name: employee.department.name,
          }
        : null,

      position: employee.position
        ? {
            id: employee.position.id,
            title: employee.position.title,
          }
        : null,

      manager: employee.manager
        ? {
            id: employee.manager.id,
            employeeNumber: employee.manager.employeeNumber,
            firstName: employee.manager.firstName,
            lastName: employee.manager.lastName,
          }
        : null,

      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
    };
  }

  static toResponseDtos(employees: Employee[]): EmployeeResponseDto[] {
    return employees.map((employee) => EmployeeMapper.toResponseDto(employee));
  }
}
