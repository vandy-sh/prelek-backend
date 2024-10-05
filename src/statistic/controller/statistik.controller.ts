import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { httpResponseHelper } from '../../core/helpers/response.helper';
import {
  StatisticGetTotalUserQuery,
  StatisticGetTotalUserQueryResult,
} from '../queries/statistic.get.total.user.queries';
import { Response } from 'express';
import {
  StatisticGetMonthlyTransactionQuery,
  StatisticGetMonthlyTransactionQueryResult,
} from '../queries/statistic.get.monthly.transaction.query';

@ApiTags('Statistic')
@Controller('statistic')
export class StatisticController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('total-user')
  async getTotalUsers(@Res() res: Response) {
    try {
      const query = Builder<StatisticGetTotalUserQuery>(
        StatisticGetTotalUserQuery,
        {},
      ).build();

      const { data } = await this.queryBus.execute<
        StatisticGetTotalUserQuery,
        StatisticGetTotalUserQueryResult
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

  @Get('monthly-transactions')
  async getMonthlyTransactions(@Res() res: Response) {
    try {
      const query = Builder<StatisticGetMonthlyTransactionQuery>(
        StatisticGetMonthlyTransactionQuery,
        {},
      ).build();

      const { data } = await this.queryBus.execute<
        StatisticGetMonthlyTransactionQuery,
        StatisticGetMonthlyTransactionQueryResult
      >(query);

      return httpResponseHelper(res, {
        data,
        statusCode: HttpStatus.OK,
        message: 'Monthly Transaction Fetched Successfully!',
      });
    } catch (error) {
      throw error;
    }
  }
}
