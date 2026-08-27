import { IsUUID } from 'class-validator';

export class AssignDepartmentDto {
  @IsUUID()
  departmentId!: string;
}
