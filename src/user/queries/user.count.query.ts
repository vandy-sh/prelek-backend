import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PrismaService } from '../../prisma/prisma.service';

export class GetTotalUsersQuery {}

@QueryHandler(GetTotalUsersQuery)
export class GetTotalUsersHandler implements IQueryHandler<GetTotalUsersQuery> {
  constructor(private readonly prisma: PrismaService) {}

  async execute(): Promise<number> {
    // Menggunakan Prisma untuk menghitung total user
    const totalUsers = await this.prisma.user.count();
    return totalUsers;
  }
}
