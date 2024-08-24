import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { Response } from 'express';
import { HasRoles } from '../../auth/decorator/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt.auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { BaseApiOkResponse } from '../../core/decorators/base.api.ok.response.decorator';
import {
  httpPaginatedResponseHelper,
  httpResponseHelper,
} from '../../core/helpers/response.helper';
import {
  UserCreateCommand,
  UserCreateCommandResult,
} from '../commands/user.create.command';
import {
  UserFindManyQuery,
  UserFindManyQueryResult,
} from '../queries/user.find.many.query';
import { UserCreateDto, UserFindManyQueryDto } from '../dto/user.dto';
import { UserEntity } from '../entities/user.entity';
import { BaseHttpPaginatedResponseDto } from '../../core/dtos/base.http.response.dto';
import { Data } from 'aws-sdk/clients/firehose';
import { UserListEntity } from '../entities/userlist.entity';

@ApiTags('User Module')
@Controller('users')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @ApiOperation({ summary: 'Creating user (admin only)' })
  @BaseApiOkResponse(UserEntity, 'object')
  @ApiBearerAuth(JwtAuthGuard.name)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles('ADMIN')
  @Post('create')
  async create(@Res() res: Response, @Body() dto: UserCreateDto) {
    try {
      const command = Builder<UserCreateCommand>(UserCreateCommand, {
        ...dto,
      }).build();

      const { data } = await this.commandBus.execute<
        UserCreateCommand,
        UserCreateCommandResult
      >(command);

      return httpResponseHelper(res, {
        data,
        statusCode: HttpStatus.OK,
        message: 'User Created Successfully!',
      });
    } catch (e) {
      throw e;
    }
  }

  @Get('')
  async findMany(@Res() res: Response, @Query() dto: UserFindManyQueryDto) {
    try {
      const builder = Builder<UserFindManyQuery>(UserFindManyQuery, {
        ...dto,
      });

      const { data, total } = await this.queryBus.execute<
        UserFindManyQuery,
        UserFindManyQueryResult
      >(builder.build());

      // responseBuilder.data(data);
      // responseBuilder.page(page);
      // responseBuilder.per_page(limit);
      // responseBuilder.total(total);

      return httpPaginatedResponseHelper(res, {
        message: 'User Fetched Successfully',
        data,
        total,
        currentPage: dto.page,
        limit: dto.limit,
      });
      // return httpResponseHelper(res, responseBuilder.build());
    } catch (error: any) {
      throw error;
    }
  }

  // @Get(':id')
  // async findById(@Res() res: Response, @Param('id') id: string) {
  //   const responseBuilder =
  //     Builder<BaseHttpResponseDto<UserEntity, any>>(BaseHttpResponseDto);
  //   responseBuilder.statusCode(200);
  //   responseBuilder.message('User Fetched Successfully');

  //   const query = Builder<UserFindByIdQuery>(UserFindByIdQuery, {
  //     id,
  //   }).build();

  //   const result = await this.queryBus.execute(query);

  //   responseBuilder.data(result);

  //   return baseHttpResponseHelper(res, responseBuilder.build());
  // }

  // @UseGuards(TenderJwtGuard)
  // @Post('update')
  // async update(@Res() res: Response, @Body() dto: UserUpdateDto) {
  //   try {
  //     const command = Builder<UserCommand>(UserUpdateCommand, {
  //       ...dto,
  //     }).build();

  //     const result = await this.commandBus.execute<
  //       UserUpdateCommand,
  //       UserUpdateCommandResult
  //     >(command);

  //     return baseHttpResponseHelper(res, {
  //       data: result,
  //       message: 'User Updated Successfully!',
  //       statusCode: HttpStatus.OK,
  //     });
  //   } catch (e) {
  //     throw e;
  //   }
  // }
}
