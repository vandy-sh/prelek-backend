import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { StatisticController } from './controller/statistik.controller';
import { StatisticGetTotalUserQueryHandler } from './queries/statistic.get.total.user.queries';
import { StatisticGetMonthlyTransactionQueryHandler } from './queries/statistic.get.monthly.transaction.query';
// import { StatisticGetPemasukanQueryHandler } from './queries/statistic.get.pemasukan.queries';
import { StatisticGetPieChartQueryHandler } from './queries/statistic.get.piechart.queries';
import { StatisticGetTotalBalanceQueryHandler } from './queries/statistic.get.total.cash.queries';
import { StatisticGetGroupByMonthQueryHandler } from './queries/statistic.get.groupby.month';
import { StatisticGetHistoryTransactionQueryHandler } from './queries/statistic.get.hisory.user';

const importedModule = [CqrsModule];
const controllers = [StatisticController];
const repositories: Provider[] = [];
const commands: Provider[] = [];
const queries: Provider[] = [
  StatisticGetTotalUserQueryHandler,
  StatisticGetMonthlyTransactionQueryHandler,
  // StatisticGetPemasukanQueryHandler,
  StatisticGetPieChartQueryHandler,
  StatisticGetTotalBalanceQueryHandler,
  StatisticGetGroupByMonthQueryHandler,
  StatisticGetHistoryTransactionQueryHandler,
];
const exportedProviders: Provider[] = [];
@Module({
  imports: [...importedModule],
  controllers: [...controllers],
  providers: [...repositories, ...commands, ...queries],
  exports: [...exportedProviders],
})
export class StatisticModule {}
