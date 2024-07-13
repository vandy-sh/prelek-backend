import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
/**
 * Organization-scoped roles used by Iqam Global / Ommar.net.
 */
export enum ROLE_TYPE_ENUM {
  ADMIN = 'ADMIN',
  FINANCE = 'FINANCE',
  OPERATOR = 'OPERATOR',
  GUEST = 'GUEST',
}

export type RoleType = keyof typeof ROLE_TYPE_ENUM;
export class CurrentUserDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  roles: RoleType;

  @ApiProperty()
  house_number: number;

  @ApiPropertyOptional()
  email: String;
}
