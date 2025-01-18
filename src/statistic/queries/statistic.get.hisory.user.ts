import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from '@prisma/client';
import { HistoryDto } from "../types";


export class StatisticGetHistoryTransactionQuery {
    constructor(public readonly userId: string) {}
  }
  
  export class StatisticGetHistoryTransactionQueryResult {
    data: HistoryDto;
  }



@QueryHandler(StatisticGetHistoryTransactionQuery)
export class StatisticGetHistoryTransactionQueryHandler
  implements IQueryHandler<StatisticGetHistoryTransactionQuery, StatisticGetHistoryTransactionQueryResult>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: StatisticGetHistoryTransactionQuery) : Promise<StatisticGetHistoryTransactionQueryResult> {
    try {
    const { userId } = query;

    const rawData: any = await this.prisma.$queryRaw(Prisma.sql`
      SELECT
        u.name AS nama_user,
        t.transaction_type AS transaksi,
        CASE
          WHEN t.status = 'FAILED' THEN 0
          ELSE t.total_amount
        END AS jumlah,
        TO_CHAR(t.created_at, 'DD/MM/YYYY') AS tanggal,
        t.status
      FROM
        transactions t
      JOIN
        users u ON t.user_id = u.user_id
      WHERE
        t.user_id = ${userId}
      ORDER BY
        t.created_at DESC;;
    `);
    console.log('usher id ', userId);

    const data: HistoryDto= rawData.map((row: any) => ({
      nama_user: row.nama_user,
      transaksi: row.transaksi,
      jumlah: row.jumlah,
      tanggal: row.tanggal,
      status: row.status,
    }));

    return { data };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
