import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { string } from 'joi';

//Menggunakan upload file secara langsung dengan form-data "mutler"
export class ActivityDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => ActivityDetailDto)
  activity_detail: ActivityDetailDto[];
}

export class ActivityDetailDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  qty: number;

  @ApiProperty()
  @IsNotEmpty()
  start_date: Date;
}

//menggunakan upload file dengan binary data
export class ActivityDtoBinary {}
