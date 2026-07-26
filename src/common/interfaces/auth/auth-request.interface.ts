import { Request } from 'express';
import { AuthUser } from './auth-user.interface';

export interface AuthRequest extends Request {
  user?: AuthUser;
}
