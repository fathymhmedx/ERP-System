import { UserResponseDto } from 'src/modules/users/dto';

export interface LoginResult {
  user: UserResponseDto;
  accessToken: string;
  refreshToken: string;
}
