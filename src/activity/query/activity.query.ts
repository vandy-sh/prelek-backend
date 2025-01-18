import { BasePaginationProps } from 'src/core/dtos/base.http.response.dto';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { ActivityListEntity } from '../entities/activity.list.entity';

export class ActivityFindManyQueryResult {
  data: ActivityListEntity[];
  total: number;
}

export class ActivityFindManyQuery extends BasePaginationProps {
  search_params?: string;
  title?: string;
  description?: string;
}

@QueryHandler(ActivityFindManyQuery)
export class ActivityFindManyQueryHandler
  implements IQueryHandler<ActivityFindManyQuery, ActivityFindManyQueryResult>
{
  constructor(private readonly prisma: PrismaService) {}

  findManyFilter(query: ActivityFindManyQuery) {
    const whereInput: Prisma.ActivityWhereInput = {}; //input berdasarkan 'nama', 'house_number', 'roles', 'phone_number' dsb

    if (query.search_params && query.search_params !== '') {
      whereInput.OR = [
        {
          title: {
            contains: query.search_params,
          },
        },
        {
          description: {
            contains: query.search_params,
          },
        },
      ];
    }

    if (query.title) {
      whereInput.title = {
        contains: query.title,
      };
    }

    if (query.description) {
      whereInput.description = query.description;
    }

    return whereInput;
  }

  async execute(
    query: ActivityFindManyQuery,
  ): Promise<ActivityFindManyQueryResult> {
    const { page, limit, sort_by, sort_direction } = query;
    try {
      // console.dir(query, { depth: null });

      const whereClause = this.findManyFilter(query);

      const orderQuery: Prisma.ActivityOrderByWithRelationInput = {};
      if (sort_by && sort_direction) {
        if (sort_by === 'start_date') {
          orderQuery.start_date = sort_direction as 'asc' | 'desc';
        } else {
          orderQuery[sort_by] = sort_direction;
        }
      } else {
        // orderQuery['created_at'] = 'desc';
      }

      const total = await this.prisma.activity.count({
        orderBy: orderQuery,
      });

      const args: Prisma.ActivityFindManyArgs = {
        where: whereClause,
        orderBy: orderQuery,
      };

      if (limit > 0) {
        // misal kita di halaman 5 / page = 5,
        // (5 - 1) * 5
        // (4 - 1) *  3
        const offset = (page - 1) * limit;
        args.skip = offset;
        args.take = limit;
      }

      const activitylist = await this.prisma.activity.findMany(args);

      return {
        data: activitylist,
        total: total,
      };
    } catch (error) {
      throw error;
    }
  }
}
