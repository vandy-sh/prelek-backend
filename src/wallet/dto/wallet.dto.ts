import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class TopUpWalletDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  house_number: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(100)
  amount: number;
}

export class WalletChargeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  wallet_id: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  cash_amount: number;
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
