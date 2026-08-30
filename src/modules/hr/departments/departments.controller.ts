import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';

import { DepartmentsService } from './departments.service';

import {
  CreateDepartmentDto,
  DepartmentResponseDto,
  UpdateDepartmentDto,
} from './dto';

import { Permissions } from 'src/common/decorators/permissions.decorator';
import { SuccessMessage } from 'src/common/decorators/success-message.decorator';
import { PERMISSIONS } from 'src/common/constants/permissions.constants';

@Controller({
  path: 'departments',
  version: '1',
})
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  /**
   * Create a new department.
   */
  @Post()
  @Permissions(PERMISSIONS.DEPARTMENTS.CREATE)
  @SuccessMessage('Department created successfully')
  create(
    @Body() createDepartmentDto: CreateDepartmentDto,
  ): Promise<DepartmentResponseDto> {
    return this.departmentsService.create(createDepartmentDto);
  }

  /**
   * Retrieve all departments.
   */
  @Get()
  @Permissions(PERMISSIONS.DEPARTMENTS.READ)
  @SuccessMessage('Departments retrieved successfully')
  findAll(): Promise<DepartmentResponseDto[]> {
    return this.departmentsService.findAll();
  }

  /**
   * Retrieve department by id.
   */
  @Get(':id')
  @Permissions(PERMISSIONS.DEPARTMENTS.READ)
  @SuccessMessage('Department retrieved successfully')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<DepartmentResponseDto> {
    return this.departmentsService.findOne(id);
  }

  /**
   * Update department.
   */
  @Patch(':id')
  @Permissions(PERMISSIONS.DEPARTMENTS.UPDATE)
  @SuccessMessage('Department updated successfully')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<DepartmentResponseDto> {
    return this.departmentsService.update(id, updateDepartmentDto);
  }

  /**
   * Soft delete department.
   */
  @Delete(':id')
  @Permissions(PERMISSIONS.DEPARTMENTS.DELETE)
  @SuccessMessage('Department deleted successfully')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.departmentsService.remove(id);
  }
}
