import { Controller } from '@nestjs/common';

import { AwsS3Service } from '../usecase/aws-s3.service';

@Controller('aws-s3')
export class AwsS3Controller {
  constructor(private awsS3Service: AwsS3Service) {}

  async uploadFile() {}
}
