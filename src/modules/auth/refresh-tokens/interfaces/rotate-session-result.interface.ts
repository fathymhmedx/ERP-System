import { User } from 'src/modules/users/entities/user.entity';

export interface RotateSessionResult {
  user: User;
  refreshToken: string;
}
