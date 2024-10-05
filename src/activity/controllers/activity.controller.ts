import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Builder } from 'builder-pattern';

import { CommandBus } from '@nestjs/cqrs';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { httpResponseHelper } from '../../core/helpers/response.helper';
import { ActivityDto } from '../dtos/activity.dtos';
import {
  ActivityAddCommand,
  ActivityAddCommandResult,
} from '../commands/activity.command';
import { JwtAuthGuard } from '../../auth/guards/jwt.auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { HasRoles } from '../../auth/decorator/roles.decorator';

@ApiTags('active')
@Controller('activities')
export class ActivityController {
  constructor(private readonly commandBus: CommandBus) {}

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
}
