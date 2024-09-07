import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserController } from './controllers/user.controller';
import { UserCreateCommandHandler } from './commands/user.create.command';
import { UserFindManyQueryHandler } from './queries/user.find.many.query';
import { UserFindByIdQueryHandler } from './queries/user.find.byId.query';
import { UserUpdateCommandHandler } from './commands/user.update.command';

const importedModule = [CqrsModule];
const controllers = [UserController];
const repositories: Provider[] = [];
const commands: Provider[] = [
  UserCreateCommandHandler,
  UserUpdateCommandHandler,
];
const queries: Provider[] = [
  UserFindManyQueryHandler,
  UserFindByIdQueryHandler,
];
const exportedProviders: Provider[] = [];
@Module({
  imports: [...importedModule],
  controllers: [...controllers],
  providers: [...repositories, ...commands, ...queries],
  exports: [...exportedProviders],
})
export class UserModule {}
