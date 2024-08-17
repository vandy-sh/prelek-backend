import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { string } from 'joi';

//Menggunakan upload file secara langsung dengan form-data "mutler"
export class ActivityDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: String;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: String;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  date: Date;

  @ApiProperty()
  photos?: Express.Multer.File[];
}

//menggunakan upload file dengan binary data
export class ActivityDtoBinary {}
