import { SetMetadata } from '@nestjs/common';
import { AUTH_CONSTANTS } from 'src/modules/auth/constants/auth.constants';

export const Permissions = (...permissions: string[]) =>
  SetMetadata(AUTH_CONSTANTS.PERMISSIONS_KEY, permissions);
