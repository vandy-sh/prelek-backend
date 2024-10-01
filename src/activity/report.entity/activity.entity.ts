import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { date, string } from 'joi';

//Menggunakan upload file secara langsung dengan form-data "mutler"
export class ActivityEntity {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: String;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => ActivityDetailEntity)
  activity_detail: ActivityDetailEntity[];
}

export class ActivityDetailEntity {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: String;

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
