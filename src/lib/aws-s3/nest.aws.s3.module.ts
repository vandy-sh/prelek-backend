import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AwsS3Module } from './aws-s3.module';

import { AwsS3ModuleOptions } from './types';
import { IAwsConfig } from '../../core/configs/aws-s3.config';
import { S3 } from '@aws-sdk/client-s3';

@Global()
@Module({
  imports: [
    AwsS3Module.forRootAsync(AwsS3Module, {
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        // console
        const awsS3 = configService.get<IAwsConfig>('awsS3');
        // console.dir(awsS3, { depth: null });

        const accessKeyId = awsS3.accessKeyId;
        const secretAccessKey = awsS3.secretAccessKey;
        const region = awsS3.region;
        const bucketName = awsS3.bucketName;

        const s3 = new S3({
          region,
          credentials: {
            accessKeyId,
            secretAccessKey,
          },
        });

        const options: AwsS3ModuleOptions = {
          accessKeyId,
          secretAccessKey,
          bucketName,
          region,
          s3,
        };

        return options;
      },
      inject: [ConfigService],
    }),
  ],
  exports: [AwsS3Module],
})
export class NestAwsS3Module {}
