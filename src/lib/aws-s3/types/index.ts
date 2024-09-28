import { S3 } from 'aws-sdk';

export class AwsS3ModuleOptions {
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  region: string;
  s3: S3;
}

export const AWS_S3_REPOSITORY = 'AWS_S3_REPOSITORY';

export const AWS_S3_MODULE_OPTIONS = 'AWS_S3_MODULE_OPTIONS';
