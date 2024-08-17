import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '../../prisma/prisma.service';
import { WalletEntity } from '../entities/wallet.entity';

export class WalletChargeCommand {
  wallet_id: string;
  cash_amount: number;
}

export class WalletChargeCommandResult {
  data: WalletEntity;
}

@CommandHandler(WalletChargeCommand)
export class WalletChargeCommandHandler
  implements ICommandHandler<WalletChargeCommand, WalletChargeCommandResult>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    command: WalletChargeCommand,
  ): Promise<WalletChargeCommandResult> {
    const { wallet_id, cash_amount } = command;
    try {
      console.dir(command, { depth: null });
      let subcriptionAmount: number = 500; // default subscription amount (minimal penarikan adalah 500 perak)
      let enoughBalance: boolean = false; // apakah saldo sudah mencukupi

      // nominal uang paling kecil 100, jika di bawah seratus maka di throw error,
      // jika ingin menggunakan wallet cash harus 0
      if (cash_amount < 100 && cash_amount > 0) {
        throw new BadRequestException('Pembayaran cash minimal 100 perak!');
      }
      const method = cash_amount > 0 ? 'CASH' : 'WALLET';
      console.log('method: ', method);

      // cek apakah wallet ada
      const userWallet = await this.prisma.wallet.findFirst({
        where: {
          id: wallet_id,
        },
        include: {
          user: true,
        },
      });
      if (!userWallet) {
        throw new NotFoundException(`Wallet not found!`);
      }
      // console.log('user yang akan di potong saldonya:');
      // console.dir(userWallet, { depth: null });

      // cari wallet si admin (untuk nantinya di tambahkan kas nya)
      const adminWallet = await this.prisma.wallet.findFirst({
        where: {
          type: 'VAULT',
        },
      });
      if (!adminWallet) {
        throw new NotFoundException(`Admin wallet not found!`);
      }
      // console.log('wallet adminnya:');
      // console.dir(adminWallet, { depth: null });

      // cek apakah transaksi sudah dilakukan atau belum (tagihan ini hanya berlaku sehari sekali)
      const isTransExist = await this.prisma.transaction.findFirst({
        where: {
          wallet_id,
          created_at: new Date(),
        },
      });
      if (isTransExist) {
        throw new BadRequestException(
          `${userWallet.user.name} telah melakukan transaksi pembayaran kas hari ini`,
        );
      }

      await this.prisma.$transaction(async (tx) => {
        // jika metode nya cash maka isi nominal wallet dari payload tersebut (jumlah uang dalam kaleng)
        if (method === 'CASH') {
          console.log('masuk ke pembayaran cash');
          console.log(
            `saldo user sebelum di top up dari kaleng ${userWallet.balance}`,
          );
          const updatedWallet = await tx.wallet.update({
            where: {
              id: wallet_id,
            },
            data: {
              balance: {
                increment: cash_amount,
              },
            },
            include: {
              user: true,
            },
          });
          console.log(
            `saldo user setelah uang di kaleng dimasukan ${updatedWallet.balance}`,
          );

          // cek nominal dari wallet user
          // jika nominalnya kurang dari nominal subscription (minimal 500 perak )
          // maka nominal subscription menjadi nominal yang tersisa
          if (updatedWallet.balance < subcriptionAmount) {
            console.log('[cash] saldo wallet tidak cukup atau kurang dari 500');
            subcriptionAmount = updatedWallet.balance; // ubah minimal subscription menjadi nominal yang tersisa
            enoughBalance = true; // ubah parameter apakah uang cukup menjadi true
          } else {
            console.log('[cash] saldo wallet cukup melebihi 500');
            // jika sudah mencukupi, maka minimal subscriptionnya tetap 500 perak
            enoughBalance = true; // ubah parameter apakah uang cukup menjadi true
          }
        }

        // jika pembayaran wallet / uang kaleng kosong
        if (method === 'WALLET') {
          console.log('masuk ke pembayaran wallet');
          console.log(`saldo user ${userWallet.balance}`);

          // cek saldo user apakah mencukupi atau tidak
          if (userWallet.balance < subcriptionAmount) {
            console.log(
              '[wallet] saldo wallet tidak cukup atau kurang dari 500',
            );
            enoughBalance = false;
          } else {
            console.log('[wallet] saldo wallet cukup melebihi 500');
            enoughBalance = true;
          }
        }

        console.log('saldo yang akan terpotong:', subcriptionAmount);

        // tambahkan transaksi berbentuk pembayaran kas ke wallet si user
        // const userTransaction = await tx.transaction.create({
        //   data: {
        //     id: nanoid(),
        //     wallet_id: command.wallet_id,
        //     transaction_type: TRANSACTION_TYPE_ENUM.SUBSCRIPTION_PAYMENT,
        //     total_amount: 500,
        //   },
        // });

        // const adminTransaction = await tx.transaction.create({
        //   data: {
        //     id: nanoid(),
        //     wallet_id: command.wallet_id,
        //     transaction_type: TRANSACTION_TYPE_ENUM.SUBSCRIPTION_INCOME,
        //     total_amount: 500,
        //   },
        // });

        // return {
        //   updatedWallet,
        //   transaction,
        // };
        throw new BadRequestException('lagi testing jangan di save!');
      });

      // const entity = Builder<WalletEntity>(WalletEntity, {
      //   ...dbProcess.updatedWallet,
      // }).build();

      // return {
      //   data: entity,
      // };
      return new WalletChargeCommandResult();
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }
}
