import { UserResponseDto } from 'src/modules/users/dto/user-response.dto';

export class LoginResponseDto {
  user!: UserResponseDto;
  accessToken!: string;
  refreshToken!: string;
}
