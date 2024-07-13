import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ClientLoginDto {
  @ApiProperty()
  @IsNumber()
  @IsInt()
  @IsNotEmpty()
  login_id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
