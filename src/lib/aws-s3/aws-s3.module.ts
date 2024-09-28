// import { HttpModule } from '@nestjs/axios';
// import { Global, Module } from '@nestjs/common';
// import { AwsS3Controller } from './controllers/aws-s3.controller';
// import { AwsS3Service } from './usecase/aws-s3.service';

// @Global()
// @Module({
//   imports: [HttpModule],
//   controllers: [AwsS3Controller],
//   providers: [AwsS3Service],
//   exports: [AwsS3Service],
// })
// export class AwsS3Module { }
import { createConfigurableDynamicRootModule } from '@golevelup/nestjs-modules';
import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AWS_S3_MODULE_OPTIONS, AwsS3ModuleOptions } from './types';
import { AwsS3Service } from './usecase/aws-s3.service';

@Global()
@Module({
  imports: [CqrsModule],
  // controllers: [BunnyHttpController],
  providers: [AwsS3Service],
  exports: [AwsS3Service],
})
export class AwsS3Module extends createConfigurableDynamicRootModule<
  AwsS3Module,
  AwsS3ModuleOptions
>(AWS_S3_MODULE_OPTIONS) {
  static deffered = () => AwsS3Module.externallyConfigured(AwsS3Module, 0);
}
