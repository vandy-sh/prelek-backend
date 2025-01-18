import { ApiProperty } from '@nestjs/swagger';

export class ActivityListEntity {
  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  start_date: Date;
}
