import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  Headers,
  InternalServerErrorException,
  NotFoundException,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { Response } from 'express';
import { httpResponseHelper } from '../../core/helpers/response.helper';
import {
  AdminLoginCommand,
  AdminLoginCommandResult,
} from '../commands/admin.login/admin.login.command';
import { AdminLoginDto } from '../dtos/requests/admin.login.dto';
import { JwtAuthGuard } from '../guards/jwt.auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { HasRoles } from '../decorator/roles.decorator';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import { CurrentUserDTO } from '../../user/types';
import { ClientLoginDto } from '../dtos/requests/client.login.dto';
import {
  ClientLoginCommand,
  ClientLoginCommandResult,
} from '../commands/client.login/client.login.command';

@ApiTags('Auth Module')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    // private readonly queryBus: QueryBus,
  ) {}

  errorMapper(e: any) {
    if (e instanceof BadRequestException) {
      return new BadRequestException(e.message);
    }
    if (e instanceof NotFoundException) {
      return new NotFoundException(e.message);
    }
    if (e instanceof UnauthorizedException) {
      return new UnauthorizedException(e.message);
    }
    if (e instanceof ConflictException) {
      return new ConflictException(e.message);
    }
    if (e instanceof ForbiddenException) {
      return new ForbiddenException(e.message);
    }

    return new InternalServerErrorException(e.message);
  }

  @ApiOperation({ summary: 'Login for admin' })
  @Post('admin/login')
  async adminLogin(
    @Body() dto: AdminLoginDto,
    @Res() res: Response,
    @Headers('x-forwarded-for') ip?: string,
    @Headers('user-agent') user_agent?: string,
  ) {
    try {
      const authLoginCommand = Builder<AdminLoginCommand>(AdminLoginCommand, {
        ...dto,
        ip: ip || '',
        user_agent: user_agent || '',
      }).build();

      const { data } = await this.commandBus.execute<
        AdminLoginCommand,
        AdminLoginCommandResult
      >(authLoginCommand);

      return httpResponseHelper(res, { data, message: 'Login Success!' });
    } catch (error) {
      throw this.errorMapper(error);
    }
  }

  @ApiOperation({ summary: 'Login for client' })
  @Post('client/login')
  async clientLogin(
    @Body() dto: ClientLoginDto,
    @Res() res: Response,
    @Headers('x-forwarded-for') ip?: string,
    @Headers('user-agent') user_agent?: string,
  ) {
    try {
      const authLoginCommand = Builder<ClientLoginCommand>(ClientLoginCommand, {
        ...dto,
        house_number: dto.login_id,
        ip: ip || '',
        user_agent: user_agent || '',
      }).build();

      const { data } = await this.commandBus.execute<
        ClientLoginCommand,
        ClientLoginCommandResult
      >(authLoginCommand);

      return httpResponseHelper(res, { data, message: 'Login Success!' });
    } catch (error) {
      throw this.errorMapper(error);
    }
  }
}
