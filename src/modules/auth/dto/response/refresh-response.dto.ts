import { UserResponseDto } from 'src/modules/users/dto';

export class RefreshResponseDto {
  user!: UserResponseDto;

  accessToken!: string;
}
