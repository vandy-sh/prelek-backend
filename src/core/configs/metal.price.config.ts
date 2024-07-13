import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { baseJoiRequiredString } from '../utils/joi.required.string';

/**
 * Metal Price Config (.env loader)
 * @author RDanang(iyoy)
 */
export interface IMetalPriceConfig {
  apiKey: string;
}

export const metalPriceConfig = registerAs(
  'metalPriceConfig',
  (): IMetalPriceConfig => {
    const values = {
      apiKey: process.env.METAL_PRICE_API_KEY,
    };

    const schema = Joi.object<IMetalPriceConfig>({
      apiKey: baseJoiRequiredString('METAL_PRICE_API_KEY'),
    });

    const { error, value } = schema.validate(values, {
      abortEarly: false,
    });
    if (error) {
      throw new Error(
        `An error occurred while validating the environment variables for Metal Price: ${error.message}`,
      );
    }

    return value;
  },
);
