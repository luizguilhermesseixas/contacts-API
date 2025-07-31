import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticatedRequest, hasValidUser } from '../../@types/request.types';

@Injectable()
export class UserAuthorizationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    if (!hasValidUser(request)) {
      throw new UnauthorizedException('Valid user authentication required');
    }

    const targetUserId = request.params['id'];
    const currentUserId = request.user.sub;

    if (!targetUserId) {
      return true;
    }

    if (currentUserId !== targetUserId) {
      throw new ForbiddenException('You can only access your own profile');
    }

    return true;
  }
}
