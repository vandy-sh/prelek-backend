import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserController } from './controllers/user.controller';
import { UserCreateCommandHandler } from './commands/user.create.command';

const importedModule = [CqrsModule];
const controllers = [UserController];
const repositories: Provider[] = [];
const commands: Provider[] = [UserCreateCommandHandler];
const queries: Provider[] = [];
const exportedProviders: Provider[] = [];
@Module({
  imports: [...importedModule],
  controllers: [...controllers],
  providers: [...repositories, ...commands, ...queries],
  exports: [...exportedProviders],
})
export class UserModule {}
