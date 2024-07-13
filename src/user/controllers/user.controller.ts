import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { Response } from 'express';
import { BaseApiOkResponse } from '../../core/decorators/base.api.ok.response.decorator';
import { httpResponseHelper } from '../../core/helpers/response.helper';
import {
  UserCreateCommand,
  UserCreateCommandResult,
} from '../commands/user.create.command';
import { UserCreateDto } from '../dto/user.dto';
import { UserEntity } from '../entities/user.entity';

@ApiTags('User Module')
@Controller('users')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    // private readonly queryBus: QueryBus,
  ) {}

  @ApiOperation({ summary: 'Creating user (admin only)' })
  @BaseApiOkResponse(UserEntity, 'object')
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

  //   @Get()
  //   async findMany(
  //     @Res() res: Response,
  //     @Query() dto: UserFindManyQueryDto,
  //   ) {
  //     const { page, limit } = dto;

  //     const responseBuilder = Builder<
  //       BaseHttpPaginatedResponseDto<UserEntity[], any>
  //     >(BaseHttpPaginatedResponseDto);
  //     responseBuilder.statusCode(200);
  //     responseBuilder.message('User List Fetched Successfully!');

  //     const builder = Builder<UserFindManyQuery>(
  //       UserFindManyQuery,
  //       {
  //         ...dto,
  //       },
  //     );

  //     const { result, total } = await this.queryBus.execute<
  //       UserFindManyQuery,
  //       UserFindManyQueryResult
  //     >(builder.build());

  //     responseBuilder.data(result);
  //     responseBuilder.page(page);
  //     responseBuilder.per_page(limit);
  //     responseBuilder.total(total);

  //     return basePaginatedResponseHelper(res, responseBuilder.build());
  //   }

  //   @Get(':id')
  //   async findById(@Res() res: Response, @Param('id') id: string) {
  //     const responseBuilder =
  //       Builder<BaseHttpResponseDto<UserEntity, any>>(
  //         BaseHttpResponseDto,
  //       );
  //     responseBuilder.statusCode(200);
  //     responseBuilder.message('User Fetched Successfully');

  //     const query = Builder<UserFindByIdQuery>(
  //       UserFindByIdQuery,
  //       {
  //         id,
  //       },
  //     ).build();

  //     const result = await this.queryBus.execute(query);

  //     responseBuilder.data(result);

  //     return baseHttpResponseHelper(res, responseBuilder.build());
  //   }

  //   @UseGuards(TenderJwtGuard)
  //   @Post('update')
  //   async update(@Res() res: Response, @Body() dto: UserUpdateDto) {
  //     try {
  //          const command = Builder<UserCommand>(
  //              UserUpdateCommand,
  //          {
  //               ...dto,
  //          },
  //          ).build();

  //      const result = await this.commandBus.execute<
  //          UserUpdateCommand,
  //          UserUpdateCommandResult
  //      >(command);

  //      return baseHttpResponseHelper(res, {
  //          data: result,
  //          message: 'User Updated Successfully!',
  //          statusCode: HttpStatus.OK,
  //      });
  //        } catch (e) {
  //          throw e;
  //        }
  //  }
}
