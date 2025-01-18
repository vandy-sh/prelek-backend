import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { BaseFilterRequest } from 'src/core/dtos/base-filter-request.dto';

//Menggunakan upload file secara langsung dengan form-data "mutler"
export class ActivityDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  start_date: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  @ValidateNested()
  @Type(() => ActivityDetailDto)
  activity_detail: ActivityDetailDto[];
}

export class ActivityDetailDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  price: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  qty: number;
}

export class ActivityFindManyQueryDto extends BaseFilterRequest {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search_params?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;
}

//menggunakan upload file dengan binary data
export class ActivityDtoBinary {}
