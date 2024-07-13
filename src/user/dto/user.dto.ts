import { ApiProperty } from '@nestjs/swagger';

export class UserCreateDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  house_number: number;

  @ApiProperty()
  phone_number: string;

  @ApiProperty()
  address: string;
}

export class UpdateUserDto {
  readonly user_id: String;
  readonly name: String;
  readonly house_number: number;
  readonly roles: String;
  readonly phone_number: number;
  readonly address: String;
}
