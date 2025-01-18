import { IQueryHandler, QueryHandler } from "@nestjs/cqrs"
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service"
import { HistoryDto, PemasukanDto } from "src/statistic/types";

export class ExportLaporanPemasukanTransaksiQuery {
    constructor(public readonly year: string) {}
}

export class ExportLaporanPemasukanTransaksiQueryResult {
    data: PemasukanDto;
    // data:any;
  }

  @QueryHandler(ExportLaporanPemasukanTransaksiQuery)
  export class ExportLaporanPemasukanTransaksiQueryHandler 
  implements IQueryHandler<ExportLaporanPemasukanTransaksiQuery, ExportLaporanPemasukanTransaksiQueryResult>{
    constructor(private readonly prisma: PrismaService) {}

    async execute(query: ExportLaporanPemasukanTransaksiQuery): Promise<ExportLaporanPemasukanTransaksiQueryResult> {
        try{

            const year = parseInt(query.year);
                if (isNaN(year)){
                    throw new Error('Invalid year format');
                }
         
            const rawData: any = await this.prisma.$queryRaw(Prisma.sql`

                SELECT
                    TO_CHAR(t.created_at, 'MM/DD/YYYY') AS bulan,
                    TO_CHAR(t.created_at, 'DD/MM/YYYY') AS tanggal,
                    a.description AS uraian,
                    TO_CHAR(SUM(total_amount), '99999999999999.99') AS total_pemasukan,
                    CASE
                        WHEN t.transaction_type = 'SUBSCRIPTION_INCOME' THEN 'Pembayaran Kas/prelek'
                        ELSE t.transaction_type
                    END AS jenis_transaksi
                    
                FROM
                    transactions t
                LEFT JOIN
                    activities a ON t.activity_id = a.id
                WHERE
                    t.transaction_type IN ('SUBSCRIPTION_INCOME')
                    AND (EXTRACT(YEAR FROM t.created_at) = ${year}
                )
                GROUP BY
                    a.description,  
                    t.transaction_type,
                    TO_CHAR(t.created_at, 'DD/MM/YYYY'),
                    TO_CHAR(t.created_at, 'MM/DD/YYYY')
                ORDER BY
                    bulan ASC,
                    tanggal ASC;
            `);
            console.log('rawData', rawData);
            console.log('Query year', query.year);
            
            return {
                data: rawData
            }
        }catch (error) {
            throw error;
          }
        
    }
}

