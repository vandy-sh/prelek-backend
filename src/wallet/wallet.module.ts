import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { WalletController } from './controllers/wallet.controller';
import { WalletTopUpCommandHandler } from './commands/wallet.top.up.command';

const importedModule = [CqrsModule];
const controllers = [WalletController];
const repositories: Provider[] = [];
const commands: Provider[] = [WalletTopUpCommandHandler];
const queries: Provider[] = [];
const exportedProviders: Provider[] = [];
@Module({
  imports: [...importedModule],
  controllers: [...controllers],
  providers: [...repositories, ...commands, ...queries],
  exports: [...exportedProviders],
})
export class WalletModule {}
