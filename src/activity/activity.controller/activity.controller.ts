import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Builder } from 'builder-pattern';

import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { HasRoles } from '../../auth/decorator/roles.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt.auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { httpResponseHelper } from '../../core/helpers/response.helper';
import { ActivityDto } from '../activity.dto/activity.dtos';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ActivityCommand,
  ActivityCommandResult,
} from '../activity.command/activity.command';

@ApiTags('active')
@Controller('activity')
export class ActivityController {
  constructor(private readonly commandBus: CommandBus) {}

  @UseInterceptors(FileFieldsInterceptor([{ name: 'images' }]))
  @Post('create/activity')
  async activities(
    @Res() res: Response,
    @Body() dto: ActivityDto,
    @UploadedFiles()
    files: {
      images?: Express.Multer.File[];
    },
  ) {
    try {
      const activityCommand = Builder<ActivityCommand>(ActivityCommand, {
        ...dto,
        photos: files.images,
      }).build();
      const result: ActivityCommandResult = await this.commandBus.execute<
        ActivityCommand,
        ActivityCommandResult
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
