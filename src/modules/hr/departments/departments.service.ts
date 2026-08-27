import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { DepartmentsRepository } from './departments.repository';
import { DepartmentMapper } from './mappers/department.mapper';

import {
  CreateDepartmentDto,
  DepartmentResponseDto,
  UpdateDepartmentDto,
} from './dto';

@Injectable()
export class DepartmentsService {
  constructor(private readonly departmentsRepository: DepartmentsRepository) {}

  /**
   * Create a new department.
   */
  async create(
    createDepartmentDto: CreateDepartmentDto,
  ): Promise<DepartmentResponseDto> {
    const { name } = createDepartmentDto;
    const exists = await this.departmentsRepository.exists({
      name,
    });

    if (exists) {
      throw new ConflictException('Department name already exists');
    }

    const department = this.departmentsRepository.create(createDepartmentDto);

    const savedDepartment = await this.departmentsRepository.save(department);

    return DepartmentMapper.toResponseDto(savedDepartment);
  }

  /**
   * Retrieve all departments.
   */
  async findAll(): Promise<DepartmentResponseDto[]> {
    const departments = await this.departmentsRepository.findAll();

    return DepartmentMapper.toResponseDtos(departments);
  }

  /**
   * Retrieve department by id.
   */
  async findOne(id: string): Promise<DepartmentResponseDto> {
    const department = await this.departmentsRepository.findById(id);

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    return DepartmentMapper.toResponseDto(department);
  }

  /**
   * Update department.
   */
  async update(
    id: string,
    updateDepartmentDto: UpdateDepartmentDto,
  ): Promise<DepartmentResponseDto> {
    const { name } = updateDepartmentDto;

    const department = await this.departmentsRepository.findById(id);

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    if (name) {
      const existingDepartment =
        await this.departmentsRepository.findByName(name);

      if (existingDepartment && existingDepartment.id !== id) {
        throw new ConflictException('Department name already exists');
      }
    }

    const updatedDepartment = this.departmentsRepository.merge(
      department,
      updateDepartmentDto,
    );

    const savedDepartment =
      await this.departmentsRepository.save(updatedDepartment);

    return DepartmentMapper.toResponseDto(savedDepartment);
  }

  /**
   * Soft delete department.
   */
  async remove(id: string): Promise<void> {
    const department = await this.departmentsRepository.findById(id);

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    await this.departmentsRepository.softDelete({
      id,
    });
  }
}
