import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { PieChartDto, TotalResponseDto } from '../types';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

export class StatisticGetPieChartQuery {
  constructor(
    public readonly year: string,
    public readonly month?: string, // Bulan bersifat opsional
  ) {}
}

export class StatisticGetPieChartQueryResult {
  data: PieChartDto;
}

@QueryHandler(StatisticGetPieChartQuery)
export class StatisticGetPieChartQueryHandler
  implements
    IQueryHandler<StatisticGetPieChartQuery, StatisticGetPieChartQueryResult>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    query: StatisticGetPieChartQuery,
  ): Promise<StatisticGetPieChartQueryResult> {
    try {
      const data: any = await this.prisma.$queryRaw(Prisma.sql`
      SELECT
    CAST(SUM(CASE WHEN transaction_type = 'TOP_UP' THEN total_amount ELSE 0 END) AS FLOAT) AS top_up,
    CAST(SUM(CASE WHEN transaction_type = 'EXPANSES' THEN total_amount ELSE 0 END) AS FLOAT) AS expanses,
    CAST(SUM(CASE WHEN transaction_type = 'SUBSCRIPTION_INCOME' THEN total_amount ELSE 0 END) AS FLOAT) AS subscriptionIncome,
    CAST(SUM(CASE WHEN transaction_type = 'SUBSCRIPTION_PAYMENT' THEN total_amount ELSE 0 END) AS FLOAT) AS subscriptionPayment
  FROM "transactions"
  WHERE EXTRACT(YEAR FROM created_at) = ${parseInt(query.year)};   
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
