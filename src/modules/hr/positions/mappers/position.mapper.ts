import { Position } from '../entities/position.entity';
import { PositionResponseDto } from '../dto';

export class PositionMapper {
  /**
   * Map Position entity to response dto.
   */
  static toResponseDto(position: Position): PositionResponseDto {
    return {
      id: position.id,
      title: position.title,
      description: position.description,
      department: {
        id: position.department.id,
        name: position.department.name,
      },
      createdAt: position.createdAt,
      updatedAt: position.updatedAt,
    };
  }

  /**
   * Map Position entities to response dtos.
   */
  static toResponseDtos(positions: Position[]): PositionResponseDto[] {
    return positions.map((position) => PositionMapper.toResponseDto(position));
  }
}
