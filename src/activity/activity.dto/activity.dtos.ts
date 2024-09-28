import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { string } from 'joi';

//Menggunakan upload file secara langsung dengan form-data "mutler"
export class ActivityDto {
  description(description: any) {
    throw new Error('Method not implemented.');
  }
  price(price: any) {
    throw new Error('Method not implemented.');
  }
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
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  qty: number;
}

//menggunakan upload file dengan binary data
export class ActivityDtoBinary {}
