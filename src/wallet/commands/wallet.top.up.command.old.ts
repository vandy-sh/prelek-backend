import { CommandHandler, ICommandBus, ICommandHandler } from '@nestjs/cqrs';
import { CurrentUserDTO } from '../../user/types';
import { WalletEntity } from '../entities/wallet.entity';
import { PrismaService } from '../../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { comparePassword } from '../../core/utils/password.util';
import { number } from 'joi';
import { UserEntity } from '../../user/entities/user.entity';
import { nanoid } from 'nanoid';
import { dir } from 'console';
import { Builder } from 'builder-pattern';

export class UpdateWalletCommand {
  house_number: number;
  amount: number;
}

export class UpdateWalletCommandResult {
  data: WalletEntity;
}

@CommandHandler(UpdateWalletCommand)
export class WalletCommandHandler
  implements ICommandHandler<UpdateWalletCommand, UpdateWalletCommandResult>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    command: UpdateWalletCommand,
  ): Promise<UpdateWalletCommandResult> {
    try {
      //cek apakah user ada
      const isUserExist = await this.prisma.user.findFirst({
        where: {
          house_number: command.house_number,
          roles: 'GUEST',
        },
      });
      console.dir(isUserExist, { depth: null });
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
            balance: userWallet.balance + command.amount,
            type: 'TOPUP',
          },
        });

        const transaction = await tx.transaction.create({
          data: {
            id: nanoid(),
            wallet_id: userWallet.id,
            transaction_type: updatedWallet.type,
            total_amount: command.amount,
          },
        });
        console.log(dir);

        return {
          updatedWallet,
          transaction,
        };
      });

      const entity = Builder<WalletEntity>(WalletEntity, {
        ...dbProcess.updatedWallet,
      }).build();

      return new UpdateWalletCommandResult();
    } catch (error) {
      console.log('ini');
      console.trace(error);
      throw error;
    }
  }
}
