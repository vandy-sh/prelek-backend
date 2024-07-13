import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { baseJoiRequiredString } from '../utils/joi.required.string';

/**
 * Currency Beans Config (.env loader)
 * @author RDanang(iyoy)
 */
export interface ICurrencyBeansConfig {
  apiKey: string;
}

export const currencyBeansConfig = registerAs(
  'currencyBeansConfig',
  (): ICurrencyBeansConfig => {
    const values = {
      apiKey: process.env.CURRENCY_BEANS_API_KEY,
    };

    const schema = Joi.object<ICurrencyBeansConfig>({
      apiKey: baseJoiRequiredString('CURRENCY_BEANS_API_KEY'),
    });

    const { error, value } = schema.validate(values, {
      abortEarly: false,
    });
    if (error) {
      throw new Error(
        `An error occurred while validating the environment variables for Currency Beans: ${error.message}`,
      );
    }

    return value;
  },
);
