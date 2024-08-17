import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { WalletEntity } from '../../../wallet/entities/wallet.entity';
import { comparePassword } from '../../../core/utils/password.util';
import { nanoid } from 'nanoid';
import { ChargeEntity } from '../entities/charge.entity';
import { Builder } from 'builder-pattern';
import { TRANSACTION_TYPE_ENUM } from '../../../transaction/entities/transaction.entities';

//PASSWORD DAN BARCODE
export class OperatorSignPasswordCommand {
  id: string;
  password: string;
}
export class OperatorSignPasswordCommandResult {
  data: WalletEntity;
}

//USER CASH
export class CashUserChargeCommand {
  id: string;
  password: string;
  amount: number;
}
export class CashUserChargeCommandResult {
  data: ChargeEntity;
}

//USER WALLET
export class WalletUserChargeCommand {
  id: string;
  password: string;
}
export class WalletUserChargeCommandResult {
  data: ChargeEntity;
}

@CommandHandler(OperatorSignPasswordCommand)
export class OperatorSignPasswordCommandHandler
  implements
    ICommandHandler<
      OperatorSignPasswordCommand,
      OperatorSignPasswordCommandResult
    >
{
  constructor(private readonly prisma: PrismaService) {}
  async execute(
    command: OperatorSignPasswordCommand,
  ): Promise<OperatorSignPasswordCommandResult> {
    try {
      // Cek apakah wallet ada
      const userWallet = await this.prisma.wallet.findUnique({
        where: {
          id: command.id,
        },
      });

      if (!userWallet) {
        throw new NotFoundException('Wallet not found!');
      }

      // Cek apakah operator atau bukan
      const isUserExist = await this.prisma.user.findFirst({
        where: {
          email: 'finance@prelek.com',
          house_number: 0,
          roles: {
            not: 'GUEST',
          },
        },
      });

      if (!isUserExist) {
        throw new UnauthorizedException(
          'Operator tidak ditemukan atau tidak memiliki izin',
        );
      }
      const currentUser = await comparePassword(
        command.password,
        isUserExist.password,
      );
      if (!currentUser) {
        throw new UnauthorizedException('Wrong credentials!');
      }
      return {
        data: userWallet,
      };
    } catch (err) {
      throw new ConflictException(err.message || 'Transaction failed');
    }
  }
}

//====================================================================================================
//====================================================================================================
//====================================================================================================
//====================================================================================================

@CommandHandler(CashUserChargeCommand)
export class CashUserChargeCommandHandler
  implements
    ICommandHandler<CashUserChargeCommand, CashUserChargeCommandResult>
{
  constructor(private readonly prisma: PrismaService) {}
  async execute(
    command: CashUserChargeCommand,
  ): Promise<CashUserChargeCommandResult> {
    try {
      const isUserExist = await this.prisma.user.findFirst({
        where: {
          email: 'finance@prelek.com',
          house_number: 0,
          roles: {
            not: 'GUEST',
          },
        },
      });
      const currentUser = await comparePassword(
        command.password,
        isUserExist.password,
      );
      if (!currentUser) {
        throw new UnauthorizedException('Wrong credentials!');
      }
      // Proses transaksi pembayaran
      const dbProcess = await this.prisma.$transaction(async (tx) => {
        const cashBalance = await tx.wallet.findUnique({
          where: {
            id: command.id,
            //   balance: {
            //     not: 200,
            //   },
            // },
            // data: {
            //   balance: {
            //     decrement: command.amount,
            //   },
          },
        });

        if (!cashBalance) {
          throw new ConflictException('Insufficient balance');
        }

        const transaction = await tx.transaction.create({
          data: {
            id: nanoid(),
            wallet_id: cashBalance.id,
            user_id: '',
            transaction_type: TRANSACTION_TYPE_ENUM.TOP_UP,
            total_amount: command.amount,
          },
        });

        const tsfrcheck = await tx.wallet.findUnique({
          where: {
            id: 'yY32dFzSj8zNrq6CoBiRm',
          },
        });
        if (!tsfrcheck) {
          throw new NotFoundException('wallet balance not found');
        }

        const tsfr = await tx.wallet.update({
          where: {
            userid: tsfrcheck.userid,
          },
          data: {
            balance: {
              increment: command.amount,
            },
          },
        });

        return {
          cashBalance,
          transaction,
        };
      });

      const entity = Builder<ChargeEntity>(ChargeEntity, {
        ...dbProcess.cashBalance,
      }).build();

      return {
        data: entity,
      };
    } catch (err) {
      throw new ConflictException(err.message || 'Transaction failed');
    }
  }
}

//====================================================================================================
//====================================================================================================
//====================================================================================================
//====================================================================================================

@CommandHandler(WalletUserChargeCommand)
export class WalletUserChargeCommandHandler
  implements
    ICommandHandler<WalletUserChargeCommand, WalletUserChargeCommandResult>
{
  constructor(private readonly prisma: PrismaService) {}
  async execute(
    command: WalletUserChargeCommand,
  ): Promise<WalletUserChargeCommandResult> {
    try {
      const isUserExist = await this.prisma.user.findFirst({
        where: {
          email: 'finance@prelek.com',
          house_number: 0,
          roles: {
            not: 'GUEST',
          },
        },
      });
      const currentUser = await comparePassword(
        command.password,
        isUserExist.password,
      );
      if (!currentUser) {
        throw new UnauthorizedException('Wrong credentials!');
      }
      // Proses transaksi pembayaran
      const dbProcess = await this.prisma.$transaction(async (tx) => {
        const currentWalletBalance = await tx.wallet.findUnique({
          where: {
            id: command.id,
          },
          select: {
            balance: true,
          },
        });

        if (currentWalletBalance.balance < 200) {
          throw new ConflictException('Insufficient balance');
        }
        const WalletBalance = await tx.wallet.update({
          where: {
            id: command.id,
          },
          data: {
            balance: {
              decrement: 200,
            },
          },
        });

        const transaction = await tx.transaction.create({
          data: {
            id: nanoid(),
            wallet_id: WalletBalance.id,
            user_id: isUserExist.user_id,
            transaction_type: TRANSACTION_TYPE_ENUM.EXPANSES,
            total_amount: 200,
          },
        });

        const tsfrcheck = await tx.wallet.findUnique({
          where: {
            id: 'yY32dFzSj8zNrq6CoBiRm',
          },
        });
        if (!tsfrcheck) {
          throw new NotFoundException('wallet balance not found');
        }

        const tsfr = await tx.wallet.update({
          where: {
            userid: tsfrcheck.userid,
          },
          data: {
            balance: {
              increment: 200,
            },
          },
        });

        return {
          WalletBalance,
          transaction,
        };
      });

      const entity = Builder<ChargeEntity>(ChargeEntity, {
        ...dbProcess.WalletBalance,
      }).build();

      return {
        data: entity,
      };
    } catch (err) {
      throw new ConflictException(err.message || 'Transaction failed');
    }
  }
}
