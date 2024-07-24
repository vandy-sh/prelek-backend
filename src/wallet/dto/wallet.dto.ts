import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class TopUpWalletDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  house_number: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}

// refactored (liat yang atas)
// export class CreateWalletDto {
//   @ApiProperty()
//   @IsNumber()
//   @IsNotEmpty()
//   house_number: number;

//   @ApiProperty()
//   @IsNumber()
//   @IsNotEmpty()
//   amount: number;
// }

//Dto untuk input
