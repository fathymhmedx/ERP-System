import { SimpleDepartmentDto } from 'src/common/dto/simple-department.dto';

export class PositionResponseDto {
  id!: string;

  title!: string;

  description!: string | null;

  department!: SimpleDepartmentDto;

  createdAt!: Date;

  updatedAt!: Date;
}
