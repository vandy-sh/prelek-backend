import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { StatisticController } from './controller/statistik.controller';
import { GetTotalUserQueryHandler } from './queries/statistic.get.total.user.queries';

const importedModule = [CqrsModule];
const controllers = [StatisticController];
const repositories: Provider[] = [];
const commands: Provider[] = [];
const queries: Provider[] = [GetTotalUserQueryHandler];
const exportedProviders: Provider[] = [];
@Module({
  imports: [...importedModule],
  controllers: [...controllers],
  providers: [...repositories, ...commands, ...queries],
  exports: [...exportedProviders],
})
export class StatisticModule {}
