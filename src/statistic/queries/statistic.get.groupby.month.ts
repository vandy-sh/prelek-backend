import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { TotalByMonthDto } from '../types';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

export class StatisticGetGroupByMonthQuery {}

export class StatisticGetGroupByMonthQueryResult {
  data: TotalByMonthDto;
}

@QueryHandler(StatisticGetGroupByMonthQuery)
export class StatisticGetGroupByMonthQueryHandler
  implements
    IQueryHandler<
      StatisticGetGroupByMonthQuery,
      StatisticGetGroupByMonthQueryResult
    >
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    query: StatisticGetGroupByMonthQuery,
  ): Promise<StatisticGetGroupByMonthQueryResult> {
    try {
      const data: any = await this.prisma.$queryRaw(Prisma.sql`
      SELECT
    DATE_TRUNC('month', created_at) AS month,
    CAST(SUM(CASE WHEN transaction_type = 'SUBSCRIPTION_INCOME' THEN total_amount ELSE 0 END) AS FLOAT) +
    CAST(SUM(CASE WHEN transaction_type = 'SUBSCRIPTION_PAYMENT' THEN total_amount ELSE 0 END) AS FLOAT) AS total_income,
    CAST(SUM(CASE WHEN transaction_type = 'EXPANSES' THEN total_amount ELSE 0 END) AS FLOAT) AS total_expenses
FROM
    "transactions"
WHERE
    transaction_type IN ('EXPANSES', 'SUBSCRIPTION_INCOME', 'TOP_UP')
GROUP BY
    month
ORDER BY
    month;

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
