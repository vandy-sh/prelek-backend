import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { WalletController } from './wallet.controller/wallet.controller';
import {
  UpdateWalletCommand,
  WalletCommandHandler,
} from './commands/wallet.top.up.command';

const importedModule = [CqrsModule];
const controllers = [WalletController];
const repositories: Provider[] = [];
const commands: Provider[] = [WalletCommandHandler];
const queries: Provider[] = [];
const exportedProviders: Provider[] = [];
@Module({
  imports: [...importedModule],
  controllers: [...controllers],
  providers: [...repositories, ...commands, ...queries],
  exports: [...exportedProviders],
})
export class WalletModule {}
