import { Department } from '../entities/department.entity';
import { DepartmentResponseDto } from '../dto';

export class DepartmentMapper {
  static toResponseDto(department: Department): DepartmentResponseDto {
    return {
      id: department.id,
      name: department.name,
      description: department.description,
      createdAt: department.createdAt,
      updatedAt: department.updatedAt,
    };
  }

  static toResponseDtos(departments: Department[]): DepartmentResponseDto[] {
    return departments.map((department) =>
      DepartmentMapper.toResponseDto(department),
    );
  }
}
