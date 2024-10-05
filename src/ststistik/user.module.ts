import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { StatistikController } from './controller/statistik.controller';
import { GetTotalUsersHandler } from './command/statistik.command';

const importedModule = [CqrsModule];
const controllers = [StatistikController];
const repositories: Provider[] = [];
const commands: Provider[] = [];
const queries: Provider[] = [GetTotalUsersHandler];
const exportedProviders: Provider[] = [];
@Module({
  imports: [...importedModule],
  controllers: [...controllers],
  providers: [...repositories, ...commands, ...queries],
  exports: [...exportedProviders],
})
export class StatistikModule {}
