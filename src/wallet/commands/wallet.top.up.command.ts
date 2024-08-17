import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Builder } from 'builder-pattern';
import { nanoid } from 'nanoid';
import { PrismaService } from '../../prisma/prisma.service';
import {
  TRANSACTION_STATUS_ENUM,
  TRANSACTION_TYPE_ENUM,
} from '../../transaction/entities/transaction.entities';
import { WalletEntity } from '../entities/wallet.entity';

export class WalletTopUpCommand {
  house_number: number;
  amount: number;
}

export class WalletTopUpCommandResult {
  data: WalletEntity;
}

@CommandHandler(WalletTopUpCommand)
export class WalletTopUpCommandHandler
  implements ICommandHandler<WalletTopUpCommand, WalletTopUpCommandResult>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    command: WalletTopUpCommand,
  ): Promise<WalletTopUpCommandResult> {
    try {
      //cek apakah user ada
      const isUserExist = await this.prisma.user.findFirst({
        where: {
          house_number: command.house_number,
          roles: 'GUEST',
        },
      });
      if (!isUserExist) {
        throw new NotFoundException(`User not found!`);
      }

      // cek apakah user punya wallet
      const userWallet = await this.prisma.wallet.findUnique({
        where: {
          userid: isUserExist.user_id,
        },
      });

      if (!userWallet) {
        throw new NotFoundException(`Wallet not found for the user!`);
      }

      const dbProcess = await this.prisma.$transaction(async (tx) => {
        const updatedWallet = await tx.wallet.update({
          where: {
            userid: isUserExist.user_id,
          },
          data: {
            balance: {
              increment: command.amount,
            },
          },
        });

        const transaction = await tx.transaction.create({
          data: {
            id: nanoid(),
            wallet_id: userWallet.id,
            user_id: isUserExist.user_id,
            status: TRANSACTION_STATUS_ENUM.SUCCESS,
            transaction_type: TRANSACTION_TYPE_ENUM.TOP_UP,
            total_amount: command.amount,
          },
        });

        return {
          updatedWallet,
          transaction,
        };
      });

      const entity = Builder<WalletEntity>(WalletEntity, {
        ...dbProcess.updatedWallet,
      }).build();

      return {
        data: entity,
      };
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }
}
