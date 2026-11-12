import { UserResponseDto } from './user-response.dto';

export class AuthUserResponseDto extends UserResponseDto {
  permissions!: string[];
}
