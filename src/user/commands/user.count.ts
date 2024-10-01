import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
// Pastikan path ini benar

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  // Fungsi untuk menghitung total user
  async getTotalUsers(): Promise<number> {
    return this.prisma.user.count();
  }
}
