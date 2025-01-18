import { QueryBus } from '@nestjs/cqrs';
import { Controller, Get, HttpStatus, Param, Res } from '@nestjs/common';
import { ExportLaporanTransaksiQuery, ExportLaporanTransaksiQueryResult } from '../commands/transaction.command';
import { ApiTags } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { httpResponseHelper } from 'src/core/helpers/response.helper';
import { Response } from 'express';
import { ExportLaporanPemasukanTransaksiQuery, ExportLaporanPemasukanTransaksiQueryResult } from '../commands/transaction. pemasukan.command';
import { ExportLaporanPengeluaranTransaksiQuery, ExportLaporanPengeluaranTransaksiQueryResult } from '../commands/transaction.pengeluaran.command';


@ApiTags('transactions')
@Controller('transactions')
export class transactionController {
  constructor(private readonly queryBus: QueryBus) {}



  @Get('laporan-transaction/:year')
  async getTransaction(@Res() res: Response, @Param('year') year: string ) {
    try {
      const query = new ExportLaporanTransaksiQuery(year);

      const { data } = await this.queryBus.execute<
      ExportLaporanTransaksiQuery,
      ExportLaporanTransaksiQueryResult
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




  @Get('laporan-transaction-pemasukan/:year')
  async getPemasukanTransaction(@Res() res: Response, @Param('year') year: string ) {
    try {
      const query = new ExportLaporanPemasukanTransaksiQuery(year);

      const { data } = await this.queryBus.execute<
      ExportLaporanPemasukanTransaksiQuery,
      ExportLaporanPemasukanTransaksiQueryResult
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

  @Get('laporan-transaction-pengeluaran/:year')
  async getPengeluaranTransaction(@Res() res: Response, @Param('year') year: string ) {
    try {
      const query = new ExportLaporanPengeluaranTransaksiQuery(year);

      const { data } = await this.queryBus.execute<
      ExportLaporanPengeluaranTransaksiQuery,
      ExportLaporanPengeluaranTransaksiQueryResult
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

