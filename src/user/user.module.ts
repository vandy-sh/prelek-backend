import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserController } from './controllers/user.controller';
import { UserCreateCommandHandler } from './commands/user.create.command';
import { UserFindManyQueryHandler } from './queries/user.find.many.query';

const importedModule = [CqrsModule];
const controllers = [UserController];
const repositories: Provider[] = [];
const commands: Provider[] = [UserCreateCommandHandler];
const queries: Provider[] = [UserFindManyQueryHandler];
const exportedProviders: Provider[] = [];
@Module({
  imports: [...importedModule],
  controllers: [...controllers],
  providers: [...repositories, ...commands, ...queries],
  exports: [...exportedProviders],
})
export class UserModule {}
