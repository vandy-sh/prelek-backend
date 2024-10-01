import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { baseJoiRequiredString } from '../utils/joi.required.string';

/**
 * AWS Config (.env loader)
 * @author RDanang(iyoy)
 */
export interface IAwsConfig {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucketName: string;
}

export const awsS3Config = registerAs('awsS3', (): IAwsConfig => {
  const values = {
    accessKeyId: process.env.AWSS3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWSS3_SECRET_ACCESS_KEY,
    region: process.env.AWSS3_REGION,
    bucketName: process.env.AWSS3_BUCKET_NAME,
  };

  const schema = Joi.object<IAwsConfig>({
    accessKeyId: baseJoiRequiredString('AWSS3_ACCESS_KEY_ID'),
    secretAccessKey: baseJoiRequiredString('AWSS3_SECRET_ACCESS_KEY'),
    region: baseJoiRequiredString('AWSS3_REGION'),
    bucketName: baseJoiRequiredString('AWSS3_BUCKET_NAME'),
  });

  const { error, value } = schema.validate(values, {
    abortEarly: false,
  });
  if (error) {
    throw new Error(
      `An error occurred while validating the environment variables for AWS S3 : ${error.message}`,
    );
  }

  return value;
});
