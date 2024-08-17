import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { WalletController } from './controllers/wallet.controller';
import { WalletTopUpCommandHandler } from './commands/wallet.top.up.command';
import { WalletChargeCommandHandler } from './commands/wallet.charge.command';

const importedModule = [CqrsModule];
const controllers = [WalletController];
const repositories: Provider[] = [];
const commands: Provider[] = [
  WalletTopUpCommandHandler,
  WalletChargeCommandHandler,
];
const queries: Provider[] = [];
const exportedProviders: Provider[] = [];
@Module({
  imports: [...importedModule],
  controllers: [...controllers],
  providers: [...repositories, ...commands, ...queries],
  exports: [...exportedProviders],
})
export class WalletModule {}
