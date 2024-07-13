import {
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from '../../../core/utils/password.util';
import { PrismaService } from '../../../prisma/prisma.service';
import { CurrentUserDTO, RoleType } from '../../../user/types';
import { Builder } from 'builder-pattern';

export class ClientLoginCommand {
  house_number: number;
  password: string;
  roles: string;
  ip?: string;
  user_agent?: string;
}

export class ClientLoginCommandResult {
  data: any;
}

@CommandHandler(ClientLoginCommand)
export class ClientLoginCommandHandler
  implements ICommandHandler<ClientLoginCommand, ClientLoginCommandResult>
{
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async execute(
    command: ClientLoginCommand,
  ): Promise<ClientLoginCommandResult> {
    const isUserExist = await this.prisma.user.findFirst({
      where: {
        house_number: command.house_number,
        roles: 'GUEST',
      },
    });

    // jika tidak ada, kembalikan error
    if (!isUserExist) {
      throw new NotFoundException(`User not found!`);
    }

    // kita compare password cocok atau tidak dengan yang di database
    const isPasswordMatching = await comparePassword(
      command.password,
      isUserExist.password,
    );

    // jika tidak cocok kembalikan error
    if (!isPasswordMatching) {
      throw new UnauthorizedException(`Wrong credentials!`);
    }

    // save user login
    await this.prisma.user.update({
      where: {
        user_id: isUserExist.user_id,
      },
      data: {
        last_login_ip: command.ip,
        last_login_user_agent: command.user_agent,
        last_login_timestamp: `${Date.now()}`,
      },
    });

    // masukan apa saja yang akan di ubah menjadi token
    const jwtPayload = {
      sub: isUserExist.user_id,
    };

    // ubah payload menjadi sebuah token
    const access_token = this.jwtService.sign(jwtPayload);
    const refresh_token = this.jwtService.sign(jwtPayload, {
      expiresIn: '7d',
    });

    const currentUser = Builder<CurrentUserDTO>(CurrentUserDTO, {
      id: isUserExist.user_id,
      name: isUserExist.name,
      email: isUserExist.email,
      roles: isUserExist.roles as RoleType,
      house_number: isUserExist.house_number,
    }).build();

    return {
      data: {
        user: currentUser,
        accessToken: access_token,
        refreshToken: refresh_token,
      },
    };
  }
}
