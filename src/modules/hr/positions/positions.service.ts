import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PositionsRepository } from './positions.repository';
import { DepartmentsRepository } from '../departments/departments.repository';

import { PositionMapper } from './mappers/position.mapper';

import {
  CreatePositionDto,
  PositionResponseDto,
  UpdatePositionDto,
} from './dto';

@Injectable()
export class PositionsService {
  constructor(
    private readonly positionsRepository: PositionsRepository,
    private readonly departmentsRepository: DepartmentsRepository,
  ) {}

  /**
   * Create a new position.
   */
  async create(
    createPositionDto: CreatePositionDto,
  ): Promise<PositionResponseDto> {
    const { title, departmentId } = createPositionDto;

    const department = await this.departmentsRepository.findById(departmentId);

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    const exists = await this.positionsRepository.findByTitleAndDepartment(
      title,
      departmentId,
    );

    if (exists) {
      throw new ConflictException('Position already exists in this department');
    }

    const position = this.positionsRepository.create({
      ...createPositionDto,
      department,
    });

    const savedPosition = await this.positionsRepository.save(position);

    return PositionMapper.toResponseDto(savedPosition);
  }

  /**
   * Retrieve all positions.
   */
  async findAll(): Promise<PositionResponseDto[]> {
    const positions = await this.positionsRepository.findAll();

    return PositionMapper.toResponseDtos(positions);
  }

  /**
   * Retrieve position by id.
   */
  async findOne(id: string): Promise<PositionResponseDto> {
    const position = await this.positionsRepository.findByIdWithDepartment(id);

    if (!position) {
      throw new NotFoundException('Position not found');
    }

    return PositionMapper.toResponseDto(position);
  }

  /**
   * Update position.
   */
  async update(
    id: string,
    updatePositionDto: UpdatePositionDto,
  ): Promise<PositionResponseDto> {
    const position = await this.positionsRepository.findByIdWithDepartment(id);

    if (!position) {
      throw new NotFoundException('Position not found');
    }

    let department = position.department;

    if (updatePositionDto.departmentId) {
      const foundDepartment = await this.departmentsRepository.findById(
        updatePositionDto.departmentId,
      );

      if (!foundDepartment) {
        throw new NotFoundException('Department not found');
      }

      department = foundDepartment;
    }

    const title = updatePositionDto.title ?? position.title;

    const existingPosition =
      await this.positionsRepository.findByTitleAndDepartment(
        title,
        department.id,
      );

    if (existingPosition && existingPosition.id !== id) {
      throw new ConflictException('Position already exists in this department');
    }

    const updatedPosition = this.positionsRepository.merge(position, {
      ...updatePositionDto,
      department,
    });

    const savedPosition = await this.positionsRepository.save(updatedPosition);

    return PositionMapper.toResponseDto(savedPosition);
  }

  /**
   * Soft delete position.
   */
  async remove(id: string): Promise<void> {
    const position = await this.positionsRepository.findById(id);

    if (!position) {
      throw new NotFoundException('Position not found');
    }

    await this.positionsRepository.softDelete({
      id,
    });
  }
}
