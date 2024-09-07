import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { appConfig } from './core/configs/app.config';
import { ConfigModule } from '@nestjs/config';
import { WalletModule } from './wallet/wallet.module';
// import { WalletsModule } from './subscription/charge/wallets.module';
import { ActivityModule } from './activity/report.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    WalletModule,
    // WalletsModule,
    ActivityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
