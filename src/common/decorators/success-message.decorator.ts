import { SetMetadata } from '@nestjs/common';
import { SUCCESS_MESSAGE_KEY } from '../constants/metadata.constants';

export const SuccessMessage = (message: string) =>
  SetMetadata(SUCCESS_MESSAGE_KEY, message);
