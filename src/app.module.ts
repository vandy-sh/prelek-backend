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
import { ActivityModule } from './activity/activity.module';
import { NestAwsS3Module } from './lib/aws-s3/nest.aws.s3.module';
import { awsS3Config } from './core/configs/aws-s3.config';
import { StatistikModule } from './ststistik/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig, awsS3Config],
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    WalletModule,
    NestAwsS3Module,
    ActivityModule,
    StatistikModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
