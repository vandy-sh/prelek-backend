import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';

import { CommandBus, CommandHandler } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { Response } from 'express';
import { HasRoles } from '../../../auth/decorator/roles.decorator';
import { JwtAuthGuard } from '../../../auth/guards/jwt.auth.guard';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { BaseApiOkResponse } from '../../../core/decorators/base.api.ok.response.decorator';
import { httpResponseHelper } from '../../../core/helpers/response.helper';
import { ChargeEntity, WALLET_TYPE_ENUM } from '../entities/charge.entity';
import {
  CashUserChargeDto,
  OperatorSignPassword,
  WalletUserChargeDto,
} from '../dtos/charge.dto';
import {
  CashUserChargeCommand,
  CashUserChargeCommandResult,
  OperatorSignPasswordCommand,
  OperatorSignPasswordCommandResult,
  WalletUserChargeCommand,
  WalletUserChargeCommandResult,
} from '../command/charge.command';
import { dir } from 'console';

@ApiTags('Charged')
@Controller('charge')
export class ChargeController {
  constructor(
    private readonly commandBus: CommandBus,
    // private readonly queryBus: QueryBus,
  ) {}

  //UNTUK MENARIK UANG DARI WALLET
  @ApiQuery({ name: 'type', enum: WALLET_TYPE_ENUM })
  @ApiOperation({ summary: 'Creating charge (operator only)' })
  @ApiBearerAuth(JwtAuthGuard.name)
  @BaseApiOkResponse(ChargeEntity, 'object')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles('FINANCE')
  @Post('scan')
  async charge(@Res() res: Response, @Body() dto: OperatorSignPassword) {
    try {
      const command = Builder<OperatorSignPasswordCommand>(
        OperatorSignPasswordCommand,
        {
          ...dto,
        },
      ).build();
      const { data } = await this.commandBus.execute<
        OperatorSignPasswordCommand,
        OperatorSignPasswordCommandResult
      >(command);
      return httpResponseHelper(res, {
        data,
        statusCode: HttpStatus.OK,
        message: 'wallet Created Successfully!',
      });
    } catch (error) {
      return httpResponseHelper(res, error);
    }
  }

  @ApiQuery({ name: 'type', enum: WALLET_TYPE_ENUM })
  @ApiOperation({ summary: 'Creating charge (operator only)' })
  @ApiBearerAuth(JwtAuthGuard.name)
  @BaseApiOkResponse(ChargeEntity, 'object')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles('FINANCE')
  @Post('cash')
  async cash(@Res() res: Response, @Body() dto: CashUserChargeDto) {
    try {
      console.log('ini');

      const command = Builder<CashUserChargeCommand>(CashUserChargeCommand, {
        ...dto,
      }).build();
      console.log('ini2');
      const { data } = await this.commandBus.execute<
        CashUserChargeCommand,
        CashUserChargeCommandResult
      >(command);
      console.log(CashUserChargeCommand);
      return httpResponseHelper(res, {
        data,
        statusCode: HttpStatus.OK,
        message: 'Transaction Successfully',
      });
    } catch (error) {
      return httpResponseHelper(res, error);
    }
  }

  @ApiQuery({ name: 'type', enum: WALLET_TYPE_ENUM })
  @ApiOperation({ summary: 'Creating charge (operator only)' })
  @ApiBearerAuth(JwtAuthGuard.name)
  @BaseApiOkResponse(ChargeEntity, 'object')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles('FINANCE')
  @Post('wallet')
  async wallet(@Res() res: Response, @Body() dto: WalletUserChargeDto) {
    try {
      console.log('ini');

      const command = Builder<WalletUserChargeCommand>(
        WalletUserChargeCommand,
        {
          ...dto,
        },
      ).build();
      console.log('ini2');
      const { data } = await this.commandBus.execute<
        WalletUserChargeCommand,
        WalletUserChargeCommandResult
      >(command);
      console.log(WalletUserChargeCommand);
      return httpResponseHelper(res, {
        data,
        statusCode: HttpStatus.OK,
        message: 'Transaction Successfully',
      });
    } catch (error) {
      return httpResponseHelper(res, error);
    }
  }
}
