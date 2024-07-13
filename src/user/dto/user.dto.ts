import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UserCreateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsInt()
  @Min(0)
  house_number: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  phone_number?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
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

export class LoginUser {
  @ApiProperty()
  house_number: number;
}
