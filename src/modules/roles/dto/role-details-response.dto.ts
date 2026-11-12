import { RoleResponseDto } from './role-response.dto';

export class RolePermissionResponseDto {
  id!: string;
  name!: string;
  module!: string;
  description!: string | null;
}

export class RoleDetailsResponseDto extends RoleResponseDto {
  permissions!: RolePermissionResponseDto[];
}
