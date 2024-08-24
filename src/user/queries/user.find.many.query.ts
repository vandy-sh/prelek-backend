import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BasePaginationProps } from '../../core/dtos/base.http.response.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { UserEntity } from '../entities/user.entity';
import { BadRequestException } from '@nestjs/common';
import { Builder } from 'builder-pattern';
import { UserListEntity } from '../entities/userlist.entity';
import { Prisma } from '@prisma/client';

export class UserFindManyQueryResult {
  data: UserListEntity[];
  total: number;
}

export class UserFindManyQuery extends BasePaginationProps {
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
    const { page, limit } = query;
    try {
      // console.dir(query, { depth: null });

      const whereClause = this.findManyFilter(query);

      const total = await this.prisma.user.count({
        where: whereClause,
      });

      const args: Prisma.UserFindManyArgs = {
        where: whereClause,
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
