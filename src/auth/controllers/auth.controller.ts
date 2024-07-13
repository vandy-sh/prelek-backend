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
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { Response } from 'express';
import { httpResponseHelper } from '../../core/helpers/response.helper';
import {
  AdminLoginCommand,
  AdminLoginCommandResult,
} from '../commands/admin.login/admin.login.command';
import { AdminLoginDto } from '../dtos/requests/login.dto';

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

  @ApiOperation({ summary: 'Login for client' })
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
}
