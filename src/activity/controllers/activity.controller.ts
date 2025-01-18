import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Builder } from 'builder-pattern';

import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import {
  httpPaginatedResponseHelper,
  httpResponseHelper,
} from '../../core/helpers/response.helper';
import { ActivityDto, ActivityFindManyQueryDto } from '../dtos/activity.dtos';
import {
  ActivityAddCommand,
  ActivityAddCommandResult,
} from '../commands/activity.command';
import { JwtAuthGuard } from '../../auth/guards/jwt.auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { HasRoles } from '../../auth/decorator/roles.decorator';
import {
  ActivityFindManyQuery,
  ActivityFindManyQueryResult,
} from '../query/activity.query';
import {
  ActivityFindByIdQuery,
  ActivityFindByIdQueryResult,
} from '../query/activity.find.byId.query';

@ApiTags('active')
@Controller('activities')
export class ActivityController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @ApiBearerAuth(JwtAuthGuard.name)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles('FINANCE')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'activity_photos', maxCount: 4 },
      { name: 'invoice_photos', maxCount: 4 },
    ]),
  )
  @Post('create')
  async activities(
    @Res() res: Response,
    @Body() dto: ActivityDto,
    @UploadedFiles()
    files: {
      activity_photos?: Express.Multer.File[];
      invoice_photos?: Express.Multer.File[];
    },
  ) {
    try {
      const activityCommand = Builder<ActivityAddCommand>(ActivityAddCommand, {
        ...dto,
        activity_photos: files.activity_photos,
        invoice_photos: files.invoice_photos,
      }).build();

      const { data } = await this.commandBus.execute<
        ActivityAddCommand,
        ActivityAddCommandResult
      >(activityCommand);

      return httpResponseHelper(res, {
        data: data,
        statusCode: HttpStatus.OK,
        message: 'Create Activity Successfully!',
      });
    } catch (error) {
      throw error;
    }
  }

  @Get('')
  async findMany(@Res() res: Response, @Query() dto: ActivityFindManyQueryDto) {
    try {
      const builder = Builder<ActivityFindManyQuery>(ActivityFindManyQuery, {
        ...dto,
      });

      const { data, total } = await this.queryBus.execute<
        ActivityFindManyQuery,
        ActivityFindManyQueryResult
      >(builder.build());

      return httpPaginatedResponseHelper(res, {
        message: 'Activity Fetched Successfully',
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
    const query = Builder<ActivityFindByIdQuery>(ActivityFindByIdQuery, {
      activity_id: id,
    }).build();

    const result = await this.queryBus.execute<
      ActivityFindByIdQuery,
      ActivityFindByIdQueryResult
    >(query);

    return httpResponseHelper(res, {
      message: 'data fetc succesfully',
      data: result.data,
    });
  }
}
