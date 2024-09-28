import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Builder } from 'builder-pattern';

import { CommandBus } from '@nestjs/cqrs';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { httpResponseHelper } from '../../core/helpers/response.helper';
import { ActivityDto } from '../activity.dto/activity.dtos';
import {
  ActivityAddCommand,
  ActivityAddCommandResult,
} from '../activity.command/activity.command';

@ApiTags('active')
@Controller('activities')
export class ActivityController {
  constructor(private readonly commandBus: CommandBus) {}

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
        statusCode: HttpStatus.OK,
        message: 'Create Activity Successfully!',
      });
    } catch (error) {
      return httpResponseHelper(res, error);
    }
  }
}
// {
//     try {
//       const command = Builder<ActivityCommand>(ActivityCommand, {
//         ...dto,
//       }).build();
//       const { data } = await this.commandBus.execute<
//         ActivityCommand,
//         ActivityCommandResult
//       >(command);
//       return httpResponseHelper(res, {
//         data,
//         statusCode: HttpStatus.OK,
//         message: 'wallet Created Successfully!',
//       });
//     } catch (error) {
//       return httpResponseHelper(res, error);
//     }
