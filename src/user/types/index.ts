import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CurrentUserDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  house_number: number;

  @ApiPropertyOptional()
  email: String;
}
