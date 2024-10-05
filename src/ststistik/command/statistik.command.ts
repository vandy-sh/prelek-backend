import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PrismaService } from '../../prisma/prisma.service';

export class GetTotalUsersCommand {
  constructor() {}
}

@CommandHandler(GetTotalUsersCommand)
export class GetTotalUsersHandler
  implements ICommandHandler<GetTotalUsersCommand>
{
  constructor(private readonly prisma: PrismaService) {}
  async execute(command: GetTotalUsersCommand): Promise<number> {
    try {
      const totalGuests = await this.prisma
        .$queryRaw<number>`SELECT COUNT(*) FROM "users" WHERE "roles" = 'GUEST'`;
      return Number(totalGuests[0].count); // Mengakses count dari hasil query
    } catch (error) {
      console.error('Error fetching total guest users:', error);
      throw error;
    }
  }
}
