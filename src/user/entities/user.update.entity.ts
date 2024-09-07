import { ApiProperty } from '@nestjs/swagger';

export class UserUpdateEntity {
  @ApiProperty()
  name: string;

  @ApiProperty()
  house_number: number;

  @ApiProperty()
  phone_number: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  password: string;
}
