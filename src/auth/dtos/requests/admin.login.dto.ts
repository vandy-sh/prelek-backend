import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AdminLoginDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  login_id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
