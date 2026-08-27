import { IsUUID } from 'class-validator';

export class AssignManagerDto {
  @IsUUID()
  managerId!: string;
}
