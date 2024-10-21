import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { TotalResponseDto } from '../types';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

export class StatisticGetPemasukanQuery {}

export class StatisticGetPemasukanQueryResult {
  data: TotalResponseDto;
}

@QueryHandler(StatisticGetPemasukanQuery)
export class StatisticGetPemasukanQueryHandler
  implements
    IQueryHandler<StatisticGetPemasukanQuery, StatisticGetPemasukanQueryResult>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    query: StatisticGetPemasukanQuery,
  ): Promise<StatisticGetPemasukanQueryResult> {
    try {
      const data: any = await this.prisma.$queryRaw(Prisma.sql`
      SELECT
    CAST(SUM(CASE
            WHEN transaction_type IN ('TOP_UP', 'SUBSCRIPTION_INCOME') THEN total_amount
            ELSE 0
        END) AS FLOAT) AS PEMASUKAN
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
