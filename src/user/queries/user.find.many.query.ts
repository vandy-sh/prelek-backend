import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Prisma } from '@prisma/client';
import { BasePaginationProps } from '../../core/dtos/base.http.response.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { UserListEntity } from '../entities/userlist.entity';

export class UserFindManyQueryResult {
  data: UserListEntity[];
  total: number;
}

export class UserFindManyQuery extends BasePaginationProps {
  search_params?: string;
  name?: string;
  house_number?: number;
  roles?: string;
  phone_number?: string;
}

@QueryHandler(UserFindManyQuery)
export class UserFindManyQueryHandler
  implements IQueryHandler<UserFindManyQuery, UserFindManyQueryResult>
{
  constructor(private readonly prisma: PrismaService) {}

  findManyFilter(query: UserFindManyQuery) {
    const whereInput: Prisma.UserWhereInput = {}; //input berdasarkan 'nama', 'house_number', 'roles', 'phone_number' dsb

    if (query.search_params && query.search_params !== '') {
      whereInput.OR = [
        {
          name: {
            contains: query.search_params,
          },
        },
        {
          phone_number: {
            contains: query.search_params,
          },
        },
        {
          roles: {
            contains: query.search_params,
          },
        },
        {
          email: {
            contains: query.search_params,
          },
        },
      ];

      if (!isNaN(parseInt(query.search_params))) {
        whereInput.OR.push({
          house_number: {
            equals: parseInt(query.search_params),
          },
        });

        whereInput.OR.push({
          Wallet: {
            balance: {
              equals: parseInt(query.search_params),
            },
          },
        });
      }
    }

    if (query.name) {
      whereInput.name = {
        contains: query.name,
      };
    }

    if (query.house_number) {
      whereInput.house_number = query.house_number;
    }

    if (query.roles) {
      whereInput.roles = query.roles;
    }

    return whereInput;
  }

  async execute(query: UserFindManyQuery): Promise<UserFindManyQueryResult> {
    const { page, limit, sort_by, sort_direction } = query;
    try {
      // console.dir(query, { depth: null });

      const whereClause = this.findManyFilter(query);

      const orderQuery: Prisma.UserOrderByWithRelationInput = {};
      if (sort_by && sort_direction) {
        orderQuery[sort_by] = sort_direction;
      } else {
        // orderQuery['created_at'] = 'desc';
      }

      const total = await this.prisma.user.count({
        where: {
          ...whereClause,
          house_number: {
            gt: 0,
          },
          roles: { equals: 'GUEST' },
        },
        orderBy: orderQuery,
      });

      const args: Prisma.UserFindManyArgs = {
        where: {
          ...whereClause,
          house_number: {
            gt: 0,
          },
          roles: { equals: 'GUEST' },
        },
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

      args.include = {
        Wallet: true,
      };

      const userlist = await this.prisma.user.findMany(args);

      return {
        data: userlist,
        total: total,
      };
    } catch (error) {
      throw error;
    }
  }
}
