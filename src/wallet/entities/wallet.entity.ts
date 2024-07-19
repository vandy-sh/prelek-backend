import { CurrentUserDTO } from '../../user/types';

export class WalletEntity {
  id: string;
  userid: string;
  balance: number;
  user: CurrentUserDTO;
}
