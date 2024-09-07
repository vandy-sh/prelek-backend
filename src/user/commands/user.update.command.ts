import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserEntity } from '../entities/user.entity';
import { PrismaService } from '../../prisma/prisma.service';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { query } from 'express';
import { hashPassword } from '../../core/utils/password.util';
import { Builder } from 'builder-pattern';
import { UserUpdateEntity } from '../entities/user.update.entity';

export class UserUpdateCommand {
  id: string;
  name: string;
  house_number: number;
  phone_number?: string;
  address?: string;
  password?: string;
}

export class UserUpdateCommandResult {
  data: UserUpdateEntity;
}

@CommandHandler(UserUpdateCommand)
export class UserUpdateCommandHandler
  implements ICommandHandler<UserUpdateCommand, UserUpdateCommandResult>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: UserUpdateCommand): Promise<UserUpdateCommandResult> {
    try {
      // cek apakah nomer rumah sudah ada yang punya nomer yang sama
      const usercheck = await this.prisma.user.findFirst({
        where: {
          house_number: command.house_number,
          NOT: {
            user_id: command.id,
          },
        },
      });
      if (usercheck)
        if (usercheck) {
          throw new ConflictException(
            `Nomor rumah ${command.house_number} telah terdaftar!`,
          );
        }

      // Cek apakah password diisi atau tidak
      let hashedPassword: string | undefined;
      if (command.password) {
        const password = command.password;
        const isValidLength = password.length >= 6; // Cek panjang minimal 6 karakter

        if (!isValidLength) {
          throw new BadRequestException(
            'Password harus memiliki minimal 6 karakter',
          );
        }

        hashedPassword = await hashPassword(password);
      }
      const updateData = {
        name: command.name,
        house_number: command.house_number,
        phone_number: command.phone_number,
        address: command.address,
        ...(hashedPassword && { password: hashedPassword }), // Tambah password hanya jika hashedPassword ada
      };

      const dbProcess = await this.prisma.$transaction(async (tx) => {
        const userUpdate = await tx.user.update({
          where: {
            user_id: command.id,
          },
          data: updateData,
        });
        console.log(userUpdate);

        // throw new BadRequestException('lagi testing jangan di save!');
        return {
          userUpdate,
        };
      });

      console.log(`user  ${command.id} updated!`);

      const entity = Builder<UserUpdateEntity>(UserUpdateEntity, {
        ...dbProcess.userUpdate,
      }).build();
      return {
        data: entity,
      };
    } catch (e) {
      throw e;
    }
  }
}
