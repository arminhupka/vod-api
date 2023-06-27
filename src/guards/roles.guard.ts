import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { User } from '../schemas/user.schema';
import { UserRoleEnum } from '../users/enums/UserRoles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  5;

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<UserRoleEnum>(
      'roles',
      context.getHandler(),
    );
    const user: User = context.switchToHttp().getRequest().user;

    if (!roles.includes(user.role)) {
      throw new ForbiddenException('You dont have permission to do that');
    }

    return true;
  }
}
