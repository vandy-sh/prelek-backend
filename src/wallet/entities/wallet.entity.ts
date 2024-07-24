import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CurrentUserDTO } from '../../user/types';
// id      String @id
// userid  String @unique()
// balance Int
// type    String // WARGA/ADMIN
// user    User   @relation(fields: [userid], references: [user_id])
// transactions Transaction[]

export class WalletEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userid: string;

  @ApiProperty()
  balance: number;

  @ApiProperty()
  type: string;

  @ApiPropertyOptional({
    required: false,
    type: () => CurrentUserDTO,
  })
  user?: CurrentUserDTO;
}

export enum WALLET_TYPE_ENUM {
  NORMAL = 'NORMAL',
  VAULT = 'VAULT',
}

export type WALLET_TYPE = keyof typeof WALLET_TYPE_ENUM;
