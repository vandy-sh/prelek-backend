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
  jwtSecret: string;
  jwtExpire: number;
  jwtRefreshExpire: number;
}

export const appConfig = registerAs('appConfig', (): IAppConfig => {
  const values = {
    port: process.env.APP_PORT ? parseInt(process.env.APP_PORT, 10) : 3002,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpire: process.env.JWT_EXPIRE_TIME
      ? parseInt(process.env.JWT_EXPIRE_TIME, 10)
      : 0,
    jwtRefreshExpire: process.env.JWT_REFRESH_EXPIRE_TIME
      ? parseInt(process.env.JWT_REFRESH_EXPIRE_TIME, 10)
      : 0,
  };

  const schema = Joi.object<IAppConfig>({
    port: baseJoiRequiredNumber('APP_PORT'),
    jwtSecret: baseJoiRequiredString('JWT_SECRET'),
    jwtExpire: baseJoiRequiredNumber('JWT_EXPIRE_TIME'),
    jwtRefreshExpire: baseJoiRequiredNumber('JWT_REFRESH_EXPIRE_TIME'),
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
