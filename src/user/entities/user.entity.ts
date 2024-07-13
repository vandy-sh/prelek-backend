import { ApiProperty } from '@nestjs/swagger';

export class UserEntity {
  @ApiProperty()
  user_id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  house_number: number;

  @ApiProperty()
  roles: string;

  @ApiProperty()
  phone_number: string;

  @ApiProperty()
  address: string;
}
