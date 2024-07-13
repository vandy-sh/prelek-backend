import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '../../prisma/prisma.service';
import { UserEntity } from '../entities/user.entity';
import { Builder } from 'builder-pattern';
import { nanoid } from 'nanoid';
import { ConflictException } from '@nestjs/common';
import { hashPassword } from '../../core/utils/password.util';

export class UserCreateCommand {
  name: string;
  password: string;
  house_number: number;
  phone_number?: string;
  address?: string;
}

export class UserCreateCommandResult {
  data: UserEntity;
}

@CommandHandler(UserCreateCommand)
export class UserCreateCommandHandler
  implements ICommandHandler<UserCreateCommand, UserCreateCommandResult>
{
  constructor(private readonly prisma: PrismaService) {}

  async execute(command: UserCreateCommand): Promise<UserCreateCommandResult> {
    try {

      // cek apakah nomer rumah sudah ada
        const isUserExist = await this.prisma.user.findFirst({
         where: {
          house_number: command.house_number
         } 
      });

      // jika ada kembalikan eror
      if(isUserExist) {
        throw new ConflictException(`Nomor rumah ${command.house_number} telah terdaftar!`);
      }


      const hashedPassword = await hashPassword(command.password);

      // membuat user
      const user = await this.prisma.user.create({
        data: {
          name: command.name,
          password: hashedPassword,
          house_number: command.house_number,
          phone_number: command.phone_number,
          address: command.address,
          roles: 'GUEST',
          user_id: nanoid(),
        },
      });

      const entity = Builder<UserEntity>(UserEntity, {
        ...user,
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
