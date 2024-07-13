import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthLoginCommandHandler } from './commands/admin.login/admin.login.command';
import { AuthController } from './controllers/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IAppConfig } from '../core/configs/app.config';

const importedModule = [
  CqrsModule,
  JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => {
      const appConfig = config.get<IAppConfig>('appConfig');
      return {
        secret: appConfig?.jwtSecret!,
        signOptions: { expiresIn: appConfig?.jwtExpire! },
      };
    },
  }),
];
const controllers = [AuthController];
const repositories: Provider[] = [AuthLoginCommandHandler];
const commands: Provider[] = [];
const queries: Provider[] = [];
const exportedProviders: Provider[] = [];
@Module({
  imports: [...importedModule],
  controllers: [...controllers],
  providers: [...repositories, ...commands, ...queries],
  exports: [...exportedProviders],
})
export class AuthModule {}
