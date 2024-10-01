import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ActivityController } from './controllers/activity.controller';
import { ActivityAddCommandHandler } from './commands/activity.command';

const importedModule = [CqrsModule];
const controllers = [ActivityController];
const repositories: Provider[] = [];
const commands: Provider[] = [ActivityAddCommandHandler];
const queries: Provider[] = [];
const exportedProviders: Provider[] = [];
@Module({
  imports: [...importedModule],
  controllers: [...controllers],
  providers: [...repositories, ...commands, ...queries],
  exports: [...exportedProviders],
})
export class ActivityModule {}
