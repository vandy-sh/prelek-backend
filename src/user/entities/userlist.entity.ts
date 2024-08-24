import { ApiProperty } from '@nestjs/swagger';

export class UserListEntity {
  @ApiProperty()
  name: string;

  @ApiProperty()
  house_number: number;

  @ApiProperty()
  roles: string;

  @ApiProperty()
  phone_number: string;

  @ApiProperty()
  address: string;
}
