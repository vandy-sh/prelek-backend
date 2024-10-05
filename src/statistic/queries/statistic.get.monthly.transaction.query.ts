import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { MonthlyDashboardTransactionDto, TotalResponseDto } from '../types';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';

export class StatisticGetMonthlyTransactionQuery {}

export class StatisticGetMonthlyTransactionQueryResult {
  data: MonthlyDashboardTransactionDto;
}

@QueryHandler(StatisticGetMonthlyTransactionQuery)
export class StatisticGetMonthlyTransactionQueryHandler
  implements
    IQueryHandler<
      StatisticGetMonthlyTransactionQuery,
      StatisticGetMonthlyTransactionQueryResult
    >
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    query: StatisticGetMonthlyTransactionQuery,
  ): Promise<StatisticGetMonthlyTransactionQueryResult> {
    try {
      const data: any = await this.prisma.$queryRaw(Prisma.sql`
      WITH monthly_series AS (SELECT to_char(
                                           DATE_TRUNC('month', CURRENT_DATE) + (GENERATE_SERIES(0, DATE_PART('days',
                                                                                                             DATE_TRUNC('month', CURRENT_DATE) +
                                                                                                             INTERVAL '1 month' -
                                                                                                             INTERVAL '1 day')::INTEGER -
                                                                                                   1)) *
                                                                               INTERVAL '1 day',
                                           'Mon FMDD'
                                   ) AS series_data),
      base_data AS (SELECT t.transaction_type,
                            SUM(t.total_amount)               as amount,
                            to_char(t.created_at, 'Mon FMDD') as date
                    FROM transactions t
                    WHERE t.transaction_type IN ('SUBSCRIPTION_PAYMENT', 'EXPANSES')
                    GROUP BY t.transaction_type, to_char(t.created_at, 'Mon FMDD')),
      payment_data AS (SELECT date,
                              SUM(CASE WHEN transaction_type = 'SUBSCRIPTION_PAYMENT' THEN amount ELSE 0 END) AS payment,
                              SUM(CASE WHEN transaction_type = 'EXPANSES' THEN amount ELSE 0 END)             AS expanses
                        FROM base_data
                        GROUP BY date)
      SELECT
          ms.series_data as date,
          COALESCE(pd.payment::INT, 0::INT) as payment,
          COALESCE(pd.expanses::INT, 0::INT) as expanses
      FROM monthly_series ms
              LEFT JOIN payment_data pd ON pd.date = ms.series_data;
      `);

      return { data };
    } catch (error) {
      throw error;
    }
  }
}
