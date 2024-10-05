import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Put,
  Res,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { GetTotalUsersCommand } from '../command/statistik.command';

@ApiTags('Statistik')
@Controller('statistik')
export class StatistikController {
  constructor(private readonly commandBus: CommandBus) {}

  @Get('total')
  async getTotalUsers() {
    try {
      const total = await this.commandBus.execute(new GetTotalUsersCommand());
      return { total }; // Mengembalikan total pengguna dalam format JSON
    } catch (error) {
      throw new HttpException(
        'Failed to fetch total users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
