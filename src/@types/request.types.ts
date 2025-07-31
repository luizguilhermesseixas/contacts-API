import { Request } from 'express';
import { User } from './user.types';

export interface AuthenticatedRequest extends Request {
  user?: {
    sub: string;
    email: string;
  }; // ← vem do JWT/Auth
  params: { id?: string };
  validatedUser?: User;
}
