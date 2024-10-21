import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PieChartDto {
  top_up: number;
  expanses: number;
  subscriptionIncome: number;
  subscriptionPayment: number;
}

export class TotalByMonthDto {
  total_income: number;
  total_expanses: number;
}

export class TotalResponseDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  total: number;
}

export class MonthlyDashboardTransactionDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  date: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  payment: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  expanses: number;
}
