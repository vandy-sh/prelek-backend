import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '../../prisma/prisma.service';
import { UserEntity } from '../entities/user.entity';
import { Builder } from 'builder-pattern';
import { nanoid } from 'nanoid';

export class UserCreateCommand {
  name: string;
  password: string;
  house_number: number;
  phone_number: string;
  address: string;
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
      const user = await this.prisma.user.create({
        data: {
          name: command.name,
          password: command.password,
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
