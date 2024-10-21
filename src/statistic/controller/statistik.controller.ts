import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
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
import {
  StatisticGetPemasukanQuery,
  StatisticGetPemasukanQueryResult,
} from '../queries/statistic.get.pemasukan.queries';
import {
  StatisticGetPieChartQuery,
  StatisticGetPieChartQueryResult,
} from '../queries/statistic.get.piechart.queries';
import {
  StatisticGetTotalBalanceQuery,
  StatisticGetTotalBalanceQueryResult,
} from '../queries/statistic.get.total.cash.queries';
import {
  StatisticGetGroupByMonthQuery,
  StatisticGetGroupByMonthQueryResult,
} from '../queries/statistic.get.groupby.month';

@ApiTags('Statistic')
@Controller('statistic')
export class StatisticController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('totalbalance')
  async getTotalBalance(@Res() res: Response) {
    try {
      const query = Builder<StatisticGetTotalBalanceQuery>(
        StatisticGetTotalBalanceQuery,
        {},
      ).build();

      const { data } = await this.queryBus.execute<
        StatisticGetTotalBalanceQuery,
        StatisticGetTotalBalanceQueryResult
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

  @Get('gruoupbymonth')
  async getGetGroupByMonth(
    @Res() res: Response,
    @Query('month') month: string,
  ) {
    try {
      const query = Builder<StatisticGetGroupByMonthQuery>(
        StatisticGetGroupByMonthQuery,
        {},
      ).build();

      const { data } = await this.queryBus.execute<
        StatisticGetGroupByMonthQuery,
        StatisticGetGroupByMonthQueryResult
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

  @Get('piechart')
  async getPengeluaran(@Res() res: Response, @Query('year') year: string) {
    try {
      const query = new StatisticGetPieChartQuery(year);

      const { data } = await this.queryBus.execute<
        StatisticGetPieChartQuery,
        StatisticGetPieChartQueryResult
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

  @Get('pemasukan')
  async getPemasukan(@Res() res: Response) {
    try {
      const query = Builder<StatisticGetPemasukanQuery>(
        StatisticGetPemasukanQuery,
        {},
      ).build();

      const { data } = await this.queryBus.execute<
        StatisticGetPemasukanQuery,
        StatisticGetPemasukanQueryResult
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
