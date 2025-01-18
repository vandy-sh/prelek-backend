import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { transactionController } from './controller/transaction.controller';
import { ExportLaporanTransaksiQueryHandler } from './commands/transaction.command';
import { ExportLaporanPemasukanTransaksiQueryHandler } from './commands/transaction. pemasukan.command';
import { ExportLaporanPengeluaranTransaksiQueryHandler } from './commands/transaction.pengeluaran.command';

const importedModule = [CqrsModule];
const controllers = [transactionController];
const repositories: Provider[] = [];
const commands: Provider[] = [];
const queries: Provider[] = [
  ExportLaporanTransaksiQueryHandler,
  ExportLaporanPemasukanTransaksiQueryHandler,
  ExportLaporanPengeluaranTransaksiQueryHandler,
    ];
const exportedProviders: Provider[] = [];
@Module({
  imports: [...importedModule],
  controllers: [...controllers],
  providers: [...repositories, ...commands, ...queries],
  exports: [...exportedProviders],
})
export class TransactionModule {}
