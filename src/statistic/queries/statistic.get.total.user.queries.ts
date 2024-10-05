import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { TotalResponseDto } from '../types';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

export class StatisticGetTotalUserQuery {}

export class StatisticGetTotalUserQueryResult {
  data: TotalResponseDto;
}

@QueryHandler(StatisticGetTotalUserQuery)
export class StatisticGetTotalUserQueryHandler
  implements
    IQueryHandler<StatisticGetTotalUserQuery, StatisticGetTotalUserQueryResult>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    query: StatisticGetTotalUserQuery,
  ): Promise<StatisticGetTotalUserQueryResult> {
    try {
      const data: any = await this.prisma.$queryRaw(Prisma.sql`
      SELECT COUNT(*)::INT from users u where u.roles = 'GUEST';
      `);

      // console.dir(data, { depth: null });

      return {
        data: {
          total: data[0].count,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}
