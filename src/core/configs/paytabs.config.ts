import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { baseJoiRequiredString } from '../utils/joi.required.string';

/**
 * Paytabs Config (.env loader)
 * @author RDanang(iyoy)
 */
export interface IPaytabsConfig {
  profileId: string;
  clientKey: string;
  serverKey: string;
}

export const paytabsConfig = registerAs('paytabsConfig', (): IPaytabsConfig => {
  const values = {
    profileId: process.env.PAYTABS_PROFILE_ID,
    clientKey: process.env.PAYTABS_CLIENT_KEY,
    serverKey: process.env.PAYTABS_SERVER_KEY,
  };

  const schema = Joi.object<IPaytabsConfig>({
    profileId: baseJoiRequiredString('PAYTABS_PROFILE_ID'),
    clientKey: baseJoiRequiredString('PAYTABS_CLIENT_KEY'),
    serverKey: baseJoiRequiredString('PAYTABS_SERVER_KEY'),
  });

  const { error, value } = schema.validate(values, {
    abortEarly: false,
  });
  if (error) {
    throw new Error(
      `An error occurred while validating the environment variables for Paytabs: ${error.message}`,
    );
  }

  return value;
});
