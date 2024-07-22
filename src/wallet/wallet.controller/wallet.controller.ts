import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt.auth.guard';
import { HasRoles } from '../../auth/decorator/roles.decorator';
import { Response } from 'express';
import { CreateWalletDto } from '../dto/wallet.dto';
import {
  UpdateWalletCommand,
  UpdateWalletCommandResult,
} from '../commands/wallet.top.up.command';
import { httpResponseHelper } from '../../core/helpers/response.helper';
import { Builder } from 'builder-pattern';
import { CommandBus } from '@nestjs/cqrs';
import { BaseApiOkResponse } from '../../core/decorators/base.api.ok.response.decorator';
import { UserEntity } from '../../user/entities/user.entity';
import { WalletEntity } from '../entities/wallet.entity';

@ApiTags('Wallet')
@Controller('wallets')
export class WalletController {
  constructor(
    private readonly commandBus: CommandBus,
    // private readonly queryBus: QueryBus,
  ) {}

  @BaseApiOkResponse(WalletEntity, 'object')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles('FINANCE')
  @Post('top-up')
  async topUp(@Res() res: Response, @Body() dto: CreateWalletDto) {
    try {
      const command = Builder<UpdateWalletCommand>(UpdateWalletCommand, {
        ...dto,
      }).build();

      const { data } = await this.commandBus.execute<
        UpdateWalletCommand,
        UpdateWalletCommandResult
      >(command);
      console.log(data);
      return httpResponseHelper(res, {
        data,
        statusCode: HttpStatus.OK,
        message: 'topUp wallet Successfully!',
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}

// const { data } = this.commandBus.execute
// <UpdateWalletCommand, UpdateWalletCommandResult>
// (command);
// return httpResponseHelper(Res, {
//   data,
//   statusCode: HttpStatus.OK,
//   message: 'User Created Successfully!',
// });
