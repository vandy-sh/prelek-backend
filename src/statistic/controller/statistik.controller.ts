import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { httpResponseHelper } from '../../core/helpers/response.helper';
import {
  GetTotalUserQuery,
  GetTotalUserQueryResult,
} from '../queries/statistic.get.total.user.queries';
import { Response } from 'express';

@ApiTags('Statistic')
@Controller('statistic')
export class StatisticController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('total-user')
  async getTotalUsers(@Res() res: Response) {
    try {
      const query = Builder<GetTotalUserQuery>(GetTotalUserQuery, {}).build();

      const { data } = await this.queryBus.execute<
        GetTotalUserQuery,
        GetTotalUserQueryResult
      >(query);

      return httpResponseHelper(res, {
        data,
        statusCode: HttpStatus.OK,
        message: 'Total User Fetched Successfully!',
      });
    } catch (error) {
      throw error;
    }
  }
}
