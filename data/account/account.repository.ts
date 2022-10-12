import { err, ok, Result } from "neverthrow";
import { v4 as uuid } from "uuid";
import { redis } from "../database-connection";
import { Account } from "./account.entity";
import { isValidPassword, storePassword } from "./password.repository";

const keyPrefix = "account:";
const lookupPrefix = "lookup:account:";

const isEmailInUse = async (email: string): Promise<boolean> => {
  const result = await redis.get(`${lookupPrefix}${email}`);
  return result !== null;
};

export const createAccount = async (account: Partial<Account>): Promise<Result<Account, Error>> => {
  if (!account.email) return err(new Error("Email is required"));
  if (!(await isEmailInUse(account.email))) return err(new Error("Email is already in use"));
  if (!account.displayName) return err(new Error("Display name is required"));
  if (!account.firstName && !account.lastName) return err(new Error("First name or last name is required"));
  if (!account.password) return err(new Error("Password is required"));

  if (!isValidPassword(account.password)) return err(new Error("Password is invalid"));

  const id = uuid();
  account.id = id;
  const saveAccountResult = await redis.set(`${keyPrefix}${id}`, JSON.stringify(account));
  if (saveAccountResult !== "OK") return err(new Error("Unable to save account"));

  const savePasswordResult = await storePassword(account.password, id);
  if (savePasswordResult.isErr()) {
    redis.del(`${keyPrefix}${id}`);
    return err(savePasswordResult.error);
  }

  await redis.set(`${lookupPrefix}${account.email}`, id);

  return ok(account as Account);
};
