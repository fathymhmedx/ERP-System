import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { EmployeesRepository } from './employees.repository';

import { DepartmentsRepository } from '../departments/departments.repository';
import { PositionsRepository } from '../positions/positions.repository';

import { EmployeeMapper } from './mappers/employee.mapper';

import {
  AssignDepartmentDto,
  AssignManagerDto,
  AssignPositionDto,
  AssignUserDto,
  CreateEmployeeDto,
  EmployeeResponseDto,
  GetEmployeesQueryDto,
  UpdateEmployeeDto,
} from './dto';
import { PaginatedResponse } from 'src/common/interfaces/pagination/paginated-response.interface';
import { UsersRepository } from 'src/modules/users/users.repository';

@Injectable()
export class EmployeesService {
  constructor(
    private readonly employeesRepository: EmployeesRepository,
    private readonly departmentsRepository: DepartmentsRepository,
    private readonly positionsRepository: PositionsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  /**
   * Create a new employee.
   */
  async create(
    createEmployeeDto: CreateEmployeeDto,
  ): Promise<EmployeeResponseDto> {
    const {
      employeeNumber,
      firstName,
      lastName,
      phone,
      address,
      dateOfBirth,
      hireDate,
    } = createEmployeeDto;

    const existingEmployee =
      await this.employeesRepository.findByEmployeeNumber(employeeNumber);

    if (existingEmployee) {
      throw new ConflictException('Employee number already exists');
    }

    const employee = this.employeesRepository.create({
      employeeNumber,
      firstName,
      lastName,
      phone: phone ?? null,
      address: address ?? null,
      dateOfBirth: dateOfBirth ?? null,
      hireDate,
    });

    const savedEmployee = await this.employeesRepository.save(employee);

    const employeeWithRelations =
      await this.employeesRepository.findByIdWithRelations(savedEmployee.id);

    if (!employeeWithRelations) {
      throw new NotFoundException('Employee not found');
    }

    return EmployeeMapper.toResponseDto(employeeWithRelations);
  }

  /**
   * Retrieve all employees.
   */
  async findAll(
    query: GetEmployeesQueryDto,
  ): Promise<PaginatedResponse<EmployeeResponseDto>> {
    const [employees, total] =
      await this.employeesRepository.findAllWithRelations(query);

    return {
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
      data: EmployeeMapper.toResponseDtos(employees),
    };
  }

  /**
   * Retrieve employee by id.
   */
  async findOne(id: string): Promise<EmployeeResponseDto> {
    const employee = await this.employeesRepository.findByIdWithRelations(id);

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return EmployeeMapper.toResponseDto(employee);
  }

  /**
   * Update employee personal information.
   */
  async update(
    id: string,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<EmployeeResponseDto> {
    const employee = await this.employeesRepository.findByIdWithRelations(id);

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const updatedEmployee = this.employeesRepository.merge(
      employee,
      updateEmployeeDto,
    );

    const savedEmployee = await this.employeesRepository.save(updatedEmployee);

    const employeeWithRelations =
      await this.employeesRepository.findByIdWithRelations(savedEmployee.id);

    if (!employeeWithRelations) {
      throw new NotFoundException('Employee not found');
    }

    return EmployeeMapper.toResponseDto(employeeWithRelations);
  }
  /**
   * Assign employee to a department.
   */
  async assignDepartment(
    id: string,
    assignDepartmentDto: AssignDepartmentDto,
  ): Promise<EmployeeResponseDto> {
    const employee = await this.employeesRepository.findByIdWithRelations(id);

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    const department = await this.departmentsRepository.findById(
      assignDepartmentDto.departmentId,
    );

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    employee.department = department;

    const savedEmployee = await this.employeesRepository.save(employee);

    const employeeWithRelations =
      await this.employeesRepository.findByIdWithRelations(savedEmployee.id);

    if (!employeeWithRelations) {
      throw new NotFoundException('Employee not found');
    }

    return EmployeeMapper.toResponseDto(employeeWithRelations);
  }

  /**
   * Assign employee to a position.
   */
  async assignPosition(
    id: string,
    assignPositionDto: AssignPositionDto,
  ): Promise<EmployeeResponseDto> {
    const employee = await this.employeesRepository.findByIdWithRelations(id);

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    if (!employee.department) {
      throw new ConflictException(
        'Employee must be assigned to a department before assigning a position',
      );
    }

    const position = await this.positionsRepository.findByIdWithDepartment(
      assignPositionDto.positionId,
    );

    if (!position) {
      throw new NotFoundException('Position not found');
    }

    if (position.department.id !== employee.department.id) {
      throw new ConflictException(
        'Position does not belong to the employee department',
      );
    }

    employee.position = position;

    const savedEmployee = await this.employeesRepository.save(employee);

    const employeeWithRelations =
      await this.employeesRepository.findByIdWithRelations(savedEmployee.id);

    if (!employeeWithRelations) {
      throw new NotFoundException('Employee not found');
    }

    return EmployeeMapper.toResponseDto(employeeWithRelations);
  }

  /**
   * Assign a manager to an employee.
   */
  async assignManager(
    id: string,
    assignManagerDto: AssignManagerDto,
  ): Promise<EmployeeResponseDto> {
    const employee = await this.employeesRepository.findByIdWithRelations(id);

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    if (id === assignManagerDto.managerId) {
      throw new ConflictException('Employee cannot be their own manager');
    }

    const manager = await this.employeesRepository.findById(
      assignManagerDto.managerId,
    );

    if (!manager) {
      throw new NotFoundException('Manager not found');
    }

    employee.manager = manager;

    const savedEmployee = await this.employeesRepository.save(employee);

    const employeeWithRelations =
      await this.employeesRepository.findByIdWithRelations(savedEmployee.id);

    if (!employeeWithRelations) {
      throw new NotFoundException('Employee not found');
    }

    return EmployeeMapper.toResponseDto(employeeWithRelations);
  }

  /**
   * Link an employee to a user account.
   */
  async assignUser(
    id: string,
    assignUserDto: AssignUserDto,
  ): Promise<EmployeeResponseDto> {
    const employee = await this.employeesRepository.findByIdWithRelations(id);

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    if (employee.user) {
      throw new ConflictException(
        'Employee is already linked to a user account',
      );
    }

    const user = await this.usersRepository.findById(assignUserDto.userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingEmployeeForUser = await this.employeesRepository.findByUserId(
      user.id,
    );

    if (existingEmployeeForUser) {
      throw new ConflictException('User is already linked to an employee');
    }

    employee.user = user;

    const savedEmployee = await this.employeesRepository.save(employee);

    const employeeWithRelations =
      await this.employeesRepository.findByIdWithRelations(savedEmployee.id);

    if (!employeeWithRelations) {
      throw new NotFoundException('Employee not found');
    }

    return EmployeeMapper.toResponseDto(employeeWithRelations);
  }

  /**
   * Soft delete employee.
   */
  async remove(id: string): Promise<void> {
    const employee = await this.employeesRepository.findById(id);

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    await this.employeesRepository.softDelete({
      id,
    });
  }
}
