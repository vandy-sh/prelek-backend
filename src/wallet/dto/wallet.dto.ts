import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsInt, IsNumber } from 'class-validator';

export class CreateWalletDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  house_number: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}

//Dto untuk input
