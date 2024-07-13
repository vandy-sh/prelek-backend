import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { baseJoiRequiredNumber } from '../utils/joi.required.number';
import { baseJoiRequiredString } from '../utils/joi.required.string';
import { baseJoiRequiredUrl } from '../utils/joi.required.url';

/**
 * App Config (.env loader)
 * @author RDanang(iyoy)
 */
export interface IAppConfig {
  port: number;
  env: string;
  jwtSecret: string;
  jwtExpire: number;
  jwtRefreshExpire: number;
  frontendUrl: string;
  backendUrl: string;
}

export const appConfig = registerAs('appConfig', (): IAppConfig => {
  const values = {
    port: process.env.APP_PORT ? parseInt(process.env.APP_PORT, 10) : 3002,
    env: process.env.SERVICE_ENV,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpire: process.env.JWT_EXPIRE_TIME
      ? parseInt(process.env.JWT_EXPIRE_TIME, 10)
      : 0,
    jwtRefreshExpire: process.env.JWT_REFRESH_EXPIRE_TIME
      ? parseInt(process.env.JWT_REFRESH_EXPIRE_TIME, 10)
      : 0,
    frontendUrl: process.env.FRONTEND_URL,
    backendUrl: process.env.BACKEND_URL,
  };

  const schema = Joi.object<IAppConfig>({
    port: baseJoiRequiredNumber('APP_PORT'),
    env: Joi.string().required().valid('dev', 'staging', 'prod'),
    jwtSecret: baseJoiRequiredString('JWT_SECRET'),
    jwtExpire: baseJoiRequiredNumber('JWT_EXPIRE_TIME'),
    jwtRefreshExpire: baseJoiRequiredNumber('JWT_REFRESH_EXPIRE_TIME'),
    frontendUrl: baseJoiRequiredUrl('FRONTEND_URL'),
    backendUrl: baseJoiRequiredUrl('BACKEND_URL'),
  });

  const { error, value } = schema.validate(values, {
    abortEarly: false,
  });
  if (error) {
    throw new Error(
      `An error occurred while validating the environment variables for App environment : ${error.message}`,
    );
  }

  return value;
});
