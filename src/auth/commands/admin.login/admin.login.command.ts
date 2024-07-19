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
import { LoginResponseDto } from '../../dtos/response.dto';

export class AdminLoginCommand {
  login_id: string;
  password: string;
  roles: string;
  ip?: string;
  user_agent?: string;
}

export class AdminLoginCommandResult {
  data: LoginResponseDto;
}

@CommandHandler(AdminLoginCommand)
export class AuthLoginCommandHandler
  implements ICommandHandler<AdminLoginCommand, AdminLoginCommandResult>
{
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async execute(command: AdminLoginCommand): Promise<AdminLoginCommandResult> {
    // cek apakah user sudah terdaftar,
    // cari yang emailnya sama dengan yang dikirimkan dari payload
    // nomer rumahnya 0
    // dan roles bukan guest
    const isUserExist = await this.prisma.user.findFirst({
      where: {
        email: command.login_id,
        house_number: 0,
        roles: {
          not: 'GUEST',
        },
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

    const data = Builder<LoginResponseDto>(LoginResponseDto, {
      user: currentUser,
      accessToken: access_token,
      refreshToken: refresh_token,
    }).build();

    return {
      data,
    };
  }
}
