import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '../../prisma/prisma.service';
import { WALLET_TYPE_ENUM, WalletEntity } from '../entities/wallet.entity';
import {
  TRANSACTION_STATUS_ENUM,
  TRANSACTION_TYPE_ENUM,
} from '../../transaction/entities/transaction.entities';
import { nanoid } from 'nanoid';

/**
 * Pembayaran KAS
 * Untuk pembayaran,
 * - operator men-scan QR dari depan rumah warga,
 * - QR CODE berisi wallet id dari user tersebut
 * - operator mengabil uang dari kaleng kas yang ada di depan rumah warga
 * - operator memasukan nominal uang yang ditarik dari dalam kaleng
 * - JIKA ada uang di dalam kaleng/cash_amount > 0, maka transaksi akan dilakukan secara cash,
 *   flow ini dilaksanakan dengan menambah saldo wallet user tersebut, dengan uang yang ada dikaleng,
 *   bila sudah ditambahkan, cek apakah saldo > minimal penarikan (500 perak), jika iya maka potong saldo wallet,
 *   jika tidak maka cek apakah saldo lebih dari 100 perak, jika iya maka potong 100 perak tersebut, jika tidak maka
 *   diamkan saldo nya, dan buat data transaksi dengan tipe gagal
 * - JIKA uang di dalam kaleng tidak ada maka transaksi dilakukan melalui wallet,
 *   flow ini dilaksanakan dengan memotong saldo wallet user tersebut, bila saldo < 100 perak,
 *   diamkan, dan buat data transaksi dengan tipe gagal, jika saldo > minimal penarikan (500 perak),
 *   maka potong 500 perak tersebut
 */
export class WalletChargeCommand {
  wallet_id: string;
  cash_amount: number;
}

export class WalletChargeCommandResult {
  data: WalletEntity;
  message: string;
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
      // console.dir(command, { depth: null });
      let subcriptionAmount: number = 500; // default subscription amount (minimal penarikan adalah 500 perak)
      let enoughBalance: boolean = false; // apakah saldo sudah mencukupi

      // nominal uang paling kecil 100, jika di bawah seratus maka di throw error,
      // jika ingin menggunakan wallet cash harus 0
      if (cash_amount < 100 && cash_amount > 0) {
        throw new BadRequestException('Pembayaran cash minimal 100 perak!');
      }
      const method = cash_amount > 0 ? 'CASH' : 'WALLET';
      // console.log('method: ', method);

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
      if (userWallet.type === WALLET_TYPE_ENUM.VAULT) {
        throw new BadRequestException(`Cannot use Vault Wallet!`);
      }
      // console.log('user yang akan di potong saldonya:');
      // console.dir(userWallet, { depth: null });

      // cari wallet si admin (untuk nantinya di tambahkan kas nya)
      const adminWallet = await this.prisma.wallet.findFirst({
        where: {
          type: 'VAULT',
        },
        include: {
          user: true,
        },
      });
      if (!adminWallet) {
        throw new NotFoundException(`Admin wallet not found!`);
      }
      // console.log('wallet adminnya:');
      // console.dir(adminWallet, { depth: null });

      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0); // Set time to 00:00:00

      const endDate = new Date();
      endDate.setHours(23, 59, 59, 999); // Set time to 23:59:59

      // cek apakah transaksi sudah dilakukan atau belum (tagihan ini hanya berlaku sehari sekali)
      const isTransExist = await this.prisma.transaction.findFirst({
        where: {
          wallet_id,
          transaction_type: {
            in: [TRANSACTION_TYPE_ENUM.SUBSCRIPTION_PAYMENT],
          },
          created_at: {
            gte: startDate,
            lte: endDate,
          },
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
          // console.log('masuk ke pembayaran cash');
          // console.log(
          //   `saldo user sebelum di top up dari kaleng ${userWallet.balance}`,
          // );
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
          // console.log(
          //   `saldo user setelah uang di kaleng dimasukan ${updatedWallet.balance}`,
          // );

          // cek nominal dari wallet user
          // jika nominalnya kurang dari nominal subscription (minimal 500 perak )
          // maka nominal subscription menjadi nominal yang tersisa
          if (updatedWallet.balance < subcriptionAmount) {
            // console.log('[cash] saldo wallet tidak cukup atau kurang dari 500');
            subcriptionAmount = updatedWallet.balance; // ubah minimal subscription menjadi nominal yang tersisa
            enoughBalance = true; // ubah parameter apakah uang cukup menjadi true
          } else {
            // console.log('[cash] saldo wallet cukup melebihi 500');
            // jika sudah mencukupi, maka minimal subscriptionnya tetap 500 perak
            enoughBalance = true; // ubah parameter apakah uang cukup menjadi true
          }
        }

        // jika pembayaran wallet / uang kaleng kosong
        if (method === 'WALLET') {
          // console.log('masuk ke pembayaran wallet');
          // console.log(`saldo user ${userWallet.balance}`);

          // cek saldo user apakah mencukupi atau tidak
          if (userWallet.balance < subcriptionAmount) {
            // console.log(
            //   '[wallet] saldo wallet tidak cukup atau kurang dari 500',
            // );

            // apakah saldo lebih atau sama dengan 100 ?
            if (userWallet.balance >= 100) {
              subcriptionAmount = userWallet.balance; // ubah minimal subscription menjadi nominal yang tersisa
              enoughBalance = true; // ubah parameter apakah uang cukup menjadi true
            } else {
              enoughBalance = false; // ubah parameter apakah uang cukup menjadi false
            }
          } else {
            // console.log('[wallet] saldo wallet cukup melebihi 500');
            enoughBalance = true;
          }
        }

        // console.log('saldo yang akan terpotong:', subcriptionAmount);
        // console.log(
        //   `Buat data transaksi ?: ${enoughBalance ? 'BUAT' : 'TIDAK'}`,
        // );

        // =  assigment (= 1x)
        // enoughBalance = false; // merubah
        // == comparasion (= 2x)
        // enoughBalance == false;  // apakah enoughBalance false ?
        // 1 == '1' // true
        // === strict comparasion (= 3x)
        // 1 === '1' // false

        // lihat apakah transaksi gagal atau tidak dari variable enoughBalance
        // jika transaksi berhasil
        if (enoughBalance) {
          // -- buat transaksi baru untuk user [STATUS= TRANSACTION_STATUS_ENUM.SUCCESS] (transaction type = TRANSACTION_TYPE_ENUM.SUBSCRIPTION_PAYMENT, jumlah / total amount = subcriptionAmount)
          const userTransaction = await tx.transaction.create({
            data: {
              id: nanoid(),
              wallet_id: userWallet.id,
              user_id: userWallet.userid,
              status: TRANSACTION_STATUS_ENUM.SUCCESS,
              transaction_type: TRANSACTION_TYPE_ENUM.SUBSCRIPTION_PAYMENT,
              total_amount: subcriptionAmount,
            },
          });
          // console.log(
          //   `data transaksi ${userWallet.user.name} berhasil di buat`,
          // );
          // console.log('data:');
          // console.dir(userTransaction, { depth: null });

          // -- buat transaksi baru untuk admin [STATUS= TRANSACTION_STATUS_ENUM.SUCCESS] (transaction type = TRANSACTION_TYPE_ENUM.SUBSCRIPTION_INCOME, total amount = subcriptionAmount)
          const adminTransaction = await tx.transaction.create({
            data: {
              id: nanoid(),
              wallet_id: adminWallet.id,
              user_id: adminWallet.userid,
              status: TRANSACTION_STATUS_ENUM.SUCCESS,
              transaction_type: TRANSACTION_TYPE_ENUM.SUBSCRIPTION_INCOME,
              total_amount: subcriptionAmount,
            },
          });
          // console.log(
          //   `data transaksi ${adminWallet.user.name} berhasil di buat`,
          // );
          // console.log('data:');
          // console.dir(adminTransaction, { depth: null });

          // -- update wallet user (setelah dikurangi) [kurangi dengan subcription amount]
          const updateWalletUser = await tx.wallet.update({
            where: {
              id: userWallet.id,
            },
            data: {
              balance: {
                decrement: subcriptionAmount,
              },
            },
            include: {
              user: true,
            },
          });
          // console.log(
          //   `saldo user ${userWallet.user.name} setelah di update: ${updateWalletUser.balance}`,
          // );

          // -- update wallet admin (setelah ditambah) [tambah dengan subcription amount]
          const updateWalletAdmin = await tx.wallet.update({
            where: {
              id: adminWallet.id,
            },
            data: {
              balance: {
                increment: subcriptionAmount,
              },
            },
            include: {
              user: true,
            },
          });
          // console.log(
          //   `Saldo admin ${adminWallet.user.name} setelah di update: ${updateWalletAdmin.balance}`,
          // );
        }

        // jika transaksi gagal
        if (!enoughBalance) {
          // console.log(
          //   'transaksi gagal karna saldo tidak mencukupi, membuat data transaksi gagal..',
          // );
          // -- buat transaksi baru untuk user [STATUS=TRANSACTION_STATUS_ENUM.FAILED] (transaction type = TRANSACTION_TYPE_ENUM.SUBSCRIPTION_PAYMENT, total amount = subcriptionAmount)
          const userTransactionFailed = await tx.transaction.create({
            data: {
              id: nanoid(),
              wallet_id: userWallet.id,
              user_id: userWallet.userid,
              status: TRANSACTION_STATUS_ENUM.FAILED,
              transaction_type: TRANSACTION_TYPE_ENUM.SUBSCRIPTION_PAYMENT,
              total_amount: subcriptionAmount,
            },
          });
          // console.log('data transaksi gagal di buat');
          // console.dir(userTransactionFailed, { depth: null });
        }

        // throw new BadRequestException('lagi testing jangan di save!');
      });

      // const entity = Builder<WalletEntity>(WalletEntity, {
      //   ...dbProcess.updatedWallet,
      // }).build();

      const updatedWallet = await this.prisma.wallet.findFirst({
        where: {
          id: wallet_id,
        },
      });
      if (!updatedWallet) {
        throw new BadRequestException('Wallet not found after update!');
      }

      return {
        data: updatedWallet,
        message: `Penarikan uang kas ${enoughBalance ? 'berhasil' : 'gagal karna saldo tidak mencukupi'} !`,
      };
    } catch (error) {
      console.trace(error);
      throw error;
    }
  }
}
