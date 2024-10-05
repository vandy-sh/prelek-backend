import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { StatisticController } from './controller/statistik.controller';
import { StatisticGetTotalUserQueryHandler } from './queries/statistic.get.total.user.queries';
import { StatisticGetMonthlyTransactionQueryHandler } from './queries/statistic.get.monthly.transaction.query';

const importedModule = [CqrsModule];
const controllers = [StatisticController];
const repositories: Provider[] = [];
const commands: Provider[] = [];
const queries: Provider[] = [
  StatisticGetTotalUserQueryHandler,
  StatisticGetMonthlyTransactionQueryHandler,
];
const exportedProviders: Provider[] = [];
@Module({
  imports: [...importedModule],
  controllers: [...controllers],
  providers: [...repositories, ...commands, ...queries],
  exports: [...exportedProviders],
})
export class StatisticModule {}
