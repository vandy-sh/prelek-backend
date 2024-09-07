import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { BasePaginationProps } from '../../core/dtos/base.http.response.dto';
import { UserListEntity } from '../entities/userlist.entity';
import { PrismaService } from '../../prisma/prisma.service';
import { userInfo } from 'os';

export class UserFindByIdQueryResult {
  data: UserListEntity;
}

export class UserFindByIdQuery {
  user_id: string;
}

@QueryHandler(UserFindByIdQuery)
export class UserFindByIdQueryHandler
  implements IQueryHandler<UserFindByIdQuery, UserFindByIdQueryResult>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: UserFindByIdQuery): Promise<UserFindByIdQueryResult> {
    try {
      const findById = await this.prisma.user.findUnique({
        where: {
          user_id: query.user_id,
        },
        select: {
          name: true,
          house_number: true,
          phone_number: true,
          address: true,
        },
      });
      console.log(query.user_id);

      return {
        data: findById,
      };
    } catch (error) {
      throw error;
    }
  }
}
