import { ApiProperty } from '@nestjs/swagger';
import { CurrentUserDTO } from '../../user/types';

export class LoginResponseDto {
  @ApiProperty({
    type: () => CurrentUserDTO,
  })
  user: CurrentUserDTO;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
