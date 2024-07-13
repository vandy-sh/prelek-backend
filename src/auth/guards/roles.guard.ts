import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CurrentUserDTO, RoleType } from '../../user/types';
import { ROLES_KEY } from '../decorator/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // fetching roles from decorator
    const allowedRoles = this.reflector.get<RoleType[]>(
      ROLES_KEY,
      context.getHandler(),
    );

    // console.dir(allowedRoles);

    // getting all request
    const request = context.switchToHttp().getRequest();

    if (!allowedRoles || allowedRoles.length === 0) {
      throw new ForbiddenException(
        'No role specified for accessing this route!',
      );
    }

    const user: CurrentUserDTO = request.user; // Assuming user information is set during authentication
    // console.dir(user);

    // if no user or user has no roles
    if (!user || !user.roles) {
      throw new ForbiddenException('Insufficient roles to access this route!');
    }

    // find out if user roles is in allowed roles
    const hasRole = allowedRoles.indexOf(user.roles) > -1;
    // console.dir(hasRole);

    if (!hasRole) {
      throw new ForbiddenException('You are not allowed to access this route!');
    }

    return true;
  }
}
