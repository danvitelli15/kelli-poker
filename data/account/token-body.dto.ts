import { Account } from "./account.entity";

export class TokenBody {
  id: string;

  static fromAccount(account: Account): TokenBody {
    return {
      id: account.id,
    };
  }
}
