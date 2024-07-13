import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

const importedModule = [CqrsModule];
const controllers = [];
const repositories: Provider[] = [];
const commands: Provider[] = [];
const queries: Provider[] = [];
const exportedProviders: Provider[] = [];
@Module({
   imports: [...importedModule],
   controllers: [...controllers],
   providers: [...repositories, ...commands, ...queries],
   exports: [...exportedProviders],
})
export class AuthModule {}