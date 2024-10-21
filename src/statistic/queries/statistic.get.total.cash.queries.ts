import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { TotalResponseDto } from '../types';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

export class StatisticGetTotalBalanceQuery {}

export class StatisticGetTotalBalanceQueryResult {
  data: TotalResponseDto;
}

@QueryHandler(StatisticGetTotalBalanceQuery)
export class StatisticGetTotalBalanceQueryHandler
  implements
    IQueryHandler<
      StatisticGetTotalBalanceQuery,
      StatisticGetTotalBalanceQueryResult
    >
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    query: StatisticGetTotalBalanceQuery,
  ): Promise<StatisticGetTotalBalanceQueryResult> {
    try {
      const data: any = await this.prisma.$queryRaw(Prisma.sql`
      SELECT
    CAST(SUM(CASE
            WHEN transaction_type IN ('TOP_UP', 'SUBSCRIPTION_INCOME') THEN total_amount
            ELSE 0
        END) AS FLOAT) AS PEMASUKAN,
    CAST(SUM(CASE
            WHEN transaction_type IN ('EXPANSES', 'SUBSCRIPTION_PAYMENT') THEN total_amount
            ELSE 0
        END) AS FLOAT) AS PENGELUARAN,
    (CAST(SUM(CASE
            WHEN transaction_type IN ('TOP_UP', 'SUBSCRIPTION_INCOME') THEN total_amount
            ELSE 0
        END) AS FLOAT)
    -
    CAST(SUM(CASE
            WHEN transaction_type IN ('EXPANSES', 'SUBSCRIPTION_PAYMENT') THEN total_amount
            ELSE 0
        END) AS FLOAT)) AS TOTAL_SALDO
FROM
    transactions;



      `);

      // console.dir(data, { depth: null });

      return {
        data,
      };
    } catch (error) {
      throw error;
    }
  }
}
