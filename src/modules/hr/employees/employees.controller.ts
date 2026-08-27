import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { Permissions } from 'src/common/decorators/permissions.decorator';
import { SuccessMessage } from 'src/common/decorators/success-message.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions.constants';

import { EmployeesService } from './employees.service';

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

@Controller({
  path: 'employees',
  version: '1',
})
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  /**
   * Create a new employee.
   */
  @Post()
  @Permissions(PERMISSIONS.EMPLOYEES.CREATE)
  @SuccessMessage('Employee created successfully')
  create(
    @Body() createEmployeeDto: CreateEmployeeDto,
  ): Promise<EmployeeResponseDto> {
    return this.employeesService.create(createEmployeeDto);
  }

  /**
   * Retrieve all employees.
   */
  @Get()
  @Permissions(PERMISSIONS.EMPLOYEES.READ)
  findAll(
    @Query() query: GetEmployeesQueryDto,
  ): Promise<PaginatedResponse<EmployeeResponseDto>> {
    return this.employeesService.findAll(query);
  }

  /**
   * Retrieve employee by id.
   */
  @Get(':id')
  @Permissions(PERMISSIONS.EMPLOYEES.READ)
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<EmployeeResponseDto> {
    return this.employeesService.findOne(id);
  }

  /**
   * Update employee personal information.
   */
  @Patch(':id')
  @Permissions(PERMISSIONS.EMPLOYEES.UPDATE)
  @SuccessMessage('Employee updated successfully')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<EmployeeResponseDto> {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  /**
   * Assign employee to a department.
   */
  @Patch(':id/department')
  @Permissions(PERMISSIONS.EMPLOYEES.ASSIGN_DEPARTMENT)
  @SuccessMessage('Employee department assigned successfully')
  assignDepartment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() assignDepartmentDto: AssignDepartmentDto,
  ): Promise<EmployeeResponseDto> {
    return this.employeesService.assignDepartment(id, assignDepartmentDto);
  }

  /**
   * Assign employee to a position.
   */
  @Patch(':id/position')
  @Permissions(PERMISSIONS.EMPLOYEES.ASSIGN_POSITION)
  @SuccessMessage('Employee position assigned successfully')
  assignPosition(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() assignPositionDto: AssignPositionDto,
  ): Promise<EmployeeResponseDto> {
    return this.employeesService.assignPosition(id, assignPositionDto);
  }

  /**
   * Assign manager to an employee.
   */
  @Patch(':id/manager')
  @Permissions(PERMISSIONS.EMPLOYEES.ASSIGN_MANAGER)
  @SuccessMessage('Employee manager assigned successfully')
  assignManager(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() assignManagerDto: AssignManagerDto,
  ): Promise<EmployeeResponseDto> {
    return this.employeesService.assignManager(id, assignManagerDto);
  }

  @Patch(':id/user')
  @Permissions(PERMISSIONS.EMPLOYEES.ASSIGN_USER)
  @SuccessMessage('Employee linked to user successfully')
  async assignUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() assignUserDto: AssignUserDto,
  ): Promise<EmployeeResponseDto> {
    return this.employeesService.assignUser(id, assignUserDto);
  }

  /**
   * Soft delete employee.
   */
  @Delete(':id')
  @Permissions(PERMISSIONS.EMPLOYEES.DELETE)
  @SuccessMessage('Employee deleted successfully')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.employeesService.remove(id);
  }
}
