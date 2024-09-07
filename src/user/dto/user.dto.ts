import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';
import { BaseFilterRequest } from '../../core/dtos/base-filter-request.dto';
import { Type } from 'class-transformer';

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

export class UserFindManyQueryDto extends BaseFilterRequest {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search_params?: string;

  @ApiPropertyOptional()
  // @ValidateIf((o) => o.house_number)
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  house_number?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  roles?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  phone_number?: string;
}
