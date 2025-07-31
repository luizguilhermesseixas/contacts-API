import { Request } from 'express';
import { User } from './user.types';

export interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
  params: { id?: string };
  validatedUser?: User;
}

// Utility type to check if the request is authenticated

export function isAuthenticatedRequest(
  req: Request,
): req is AuthenticatedRequest {
  return 'user' in req && typeof req.user === 'object' && req.user !== null;
}

export function hasValidUser(
  req: AuthenticatedRequest,
): req is AuthenticatedRequest & { user: JwtPayload } {
  return (
    req.user !== undefined &&
    typeof req.user.sub === 'string' &&
    typeof req.user.email === 'string'
  );
}
