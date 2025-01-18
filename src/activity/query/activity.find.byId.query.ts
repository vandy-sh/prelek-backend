import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from '../../prisma/prisma.service';
import { ActivityEntity } from '../entities/activity.entity';
import { BadRequestException } from '@nestjs/common';

export class ActivityFindByIdQueryResult {
  data: ActivityEntity;
}

export class ActivityFindByIdQuery {
  activity_id: string;
}

@QueryHandler(ActivityFindByIdQuery)
export class ActivityFindByIdQueryHandler
  implements IQueryHandler<ActivityFindByIdQuery, ActivityFindByIdQueryResult>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: ActivityFindByIdQuery) {
    try {
      const activity = await this.prisma.activity.findUnique({
        where: {
          id: query.activity_id,
        },
        include: {
          photos: true,
          transaction: true,
          activity_details: true,
        },
      });

      if (!activity) {
        throw new BadRequestException('Activity not found!');
      }
      return {
        data: activity,
      };
    } catch (error) {
      throw error;
    }
  }
}
