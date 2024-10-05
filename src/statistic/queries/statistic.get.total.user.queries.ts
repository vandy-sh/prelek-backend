import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { TotalResponseDto } from '../types';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

export class GetTotalUserQuery {}

export class GetTotalUserQueryResult {
  data: TotalResponseDto;
}

@QueryHandler(GetTotalUserQuery)
export class GetTotalUserQueryHandler
  implements IQueryHandler<GetTotalUserQuery, GetTotalUserQueryResult>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: GetTotalUserQuery): Promise<GetTotalUserQueryResult> {
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
