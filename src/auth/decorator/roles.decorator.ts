import { SetMetadata } from '@nestjs/common';
import { RoleType } from '../../user/types';

export const ROLES_KEY = 'roles';
export const HasRoles = (...roles: RoleType[]) => SetMetadata(ROLES_KEY, roles);
