import { IsUUID } from 'class-validator';

export class AssignPermissionDto {
  @IsUUID()
  permissionId!: string;
}
