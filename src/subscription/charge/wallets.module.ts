import { CqrsModule } from '@nestjs/cqrs';
import { ChargeController } from './controller/charge.controller';
import {
  CashUserChargeCommandHandler,
  OperatorSignPasswordCommandHandler,
  WalletUserChargeCommandHandler,
} from './command/charge.command';
import { Module, Provider } from '@nestjs/common';

const importedModule = [CqrsModule];
const controllers = [ChargeController];
const repositories: Provider[] = [];
const commands: Provider[] = [
  OperatorSignPasswordCommandHandler,
  CashUserChargeCommandHandler,
  WalletUserChargeCommandHandler,
];
const queries: Provider[] = [];
const exportedProviders: Provider[] = [];
@Module({
  imports: [...importedModule],
  controllers: [...controllers],
  providers: [...repositories, ...commands, ...queries],
  exports: [...exportedProviders],
})
export class WalletsModule {}
