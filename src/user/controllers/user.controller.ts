import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
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
import {
  UserCreateDto,
  UserFindManyQueryDto,
  UserUpdateDto,
} from '../dto/user.dto';
import { UserEntity } from '../entities/user.entity';
import {
  BaseHttpPaginatedResponseDto,
  BaseHttpResponseDto,
} from '../../core/dtos/base.http.response.dto';
import { Data } from 'aws-sdk/clients/firehose';
import { UserListEntity } from '../entities/userlist.entity';
// import {
//   UserUpdateCommand,
//   UserUpdateCommandResult,
// } from '../commands/user.update.command';
import {
  UserFindByIdQuery,
  UserFindByIdQueryResult,
} from '../queries/user.find.byId.query';
import { BasePaginationApiOkResponse } from '../../core/decorators/base.pagination.api.ok.response.decorator';
import {
  UserUpdateCommand,
  UserUpdateCommandResult,
} from '../commands/user.update.command';
import { GetUsageTotalsRequest } from 'aws-sdk/clients/macie2';
import { GetTotalUsersQuery } from '../queries/user.count.query';

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
  @Get('count')
  async getTotalUsers(@Res() res: Response) {
    const totalUsers = (await this.commandBus.execute)<
      GetTotalUsersQuery,
      number
    >(new GetTotalUsersQuery());
    return res.status(200).json({
      message: 'Total Users Fetched Successfully',
      total: totalUsers,
    });
  }
  catch(error: any) {
    // Menangani error
    throw error;
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

  @Get(':id')
  async findById(@Res() res: Response, @Param('id') id: string) {
    // const responseBuilder =
    //   Builder<BaseHttpResponseDto<UserEntity, any>>(BaseHttpResponseDto);
    // responseBuilder.statusCode(200);
    // responseBuilder.message('User Fetched Successfully');

    const query = Builder<UserFindByIdQuery>(UserFindByIdQuery, {
      user_id: id,
    }).build();

    const result = await this.queryBus.execute<
      UserFindByIdQuery,
      UserFindByIdQueryResult
    >(query);

    return httpResponseHelper(res, {
      message: 'data fetc succesfully',
      data: result.data,
    });
  }

  @ApiBearerAuth(JwtAuthGuard.name)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles('ADMIN')
  @Put('update/:id')
  async update(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() dto: UserUpdateDto,
  ) {
    try {
      const command = Builder<UserUpdateCommand>(UserUpdateCommand, {
        id,
        ...dto,
      }).build();

      console.log(`ser id ${id}`);
      const result = await this.commandBus.execute<
        UserUpdateCommand,
        UserUpdateCommandResult
      >(command);

      return httpResponseHelper(res, {
        // data: result,
        message: 'User Updated Successfully!',
        statusCode: HttpStatus.OK,
      });
    } catch (e) {
      throw e;
    }
  }

  // Endpoint untuk mendapatkan jumlah total user
}
