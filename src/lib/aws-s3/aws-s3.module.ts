import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { AwsS3Controller } from './controllers/aws-s3.controller';
import { AwsS3Service } from './usecase/aws-s3.service';

@Global()
@Module({
  imports: [HttpModule],
  controllers: [AwsS3Controller],
  providers: [AwsS3Service],
  exports: [AwsS3Service],
})
export class AwsS3Module { }
