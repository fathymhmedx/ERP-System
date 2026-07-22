import { SetMetadata } from '@nestjs/common';
import { Permission } from '../constants/permissions.constants';
import { PERMISSIONS_KEY } from '../constants/metadata.constants';

export const Permissions = (...permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
