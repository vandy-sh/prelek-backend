import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Builder } from 'builder-pattern';
import { PrismaService } from '../../prisma/prisma.service';
import { IAppConfig } from '../../core/configs/app.config';
import { CurrentUserDTO, RoleType } from '../../user/types';

interface IJwtPayload {
  sub: string;
  iat: number;
  exp: number;
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          let token = null;

          const cookie = req?.cookies?.access_token;
          if (cookie) {
            token = cookie;
          }

          // check if the request has bearer auth
          if (req?.headers?.authorization) {
            const authHeader = req?.headers?.authorization;
            token = authHeader.split(' ')[1];
          }

          // check if the request has bearer token
          if (!token) {
            throw new UnauthorizedException(
              'You must be logged in to access this route!',
            );
          }

          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<IAppConfig>('appConfig')?.jwtSecret!,
    });
  }

  async validate(payload: IJwtPayload) {
    const isTokenExpired = payload.exp < Date.now() / 1000;
    if (isTokenExpired) {
      throw new UnauthorizedException('Token expired!');
    }

    const user = await this.prisma.user.findFirst({
      where: {
        user_id: payload.sub,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid Credentials!');
    }

    const currentUser = Builder<CurrentUserDTO>(CurrentUserDTO, {
      id: user.user_id,
      name: user.name,
      email: user.email,
      roles: user.roles as RoleType,
      house_number: user.house_number,
    }).build();

    return currentUser;
  }
}
