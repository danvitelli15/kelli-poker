import { JwtPayload, sign, verify } from "jsonwebtoken";
import { Err, err, ok, Result } from "neverthrow";
import { v4 as uuid } from "uuid";
import { loggerFactory } from "../../utils/logger";
import { redis } from "../database-connection";
import { Account } from "./account.entity";
import { CreateAccoutnRequest } from "./create-account-request.dto";
import { isValidPassword, storePassword, verifyPassword } from "./password.repository";
import { TokenBody } from "./token-body.dto";

const logger = loggerFactory("account.repository");

const keyPrefix = "account:";
const lookupPrefix = "lookup:account:";

const isEmailInUse = async (email: string): Promise<boolean> => {
  const result = await redis.get(`${lookupPrefix}${email}`);
  logger.debug({ email, result });
  return result !== null;
};

export const createAccount = async (account: CreateAccoutnRequest): Promise<Result<string, Error>> => {
  logger.trace({ ...account });
  const passworIssues: Err<never, Error>[] = [];
  if (!account.email) passworIssues.push(err(new Error("Email is required")));
  if (await isEmailInUse(account.email)) passworIssues.push(err(new Error("Email is already in use")));
  if (!account.displayName) passworIssues.push(err(new Error("Display name is required")));
  if (!account.firstName && !account.lastName)
    passworIssues.push(err(new Error("First name or last name is required")));
  if (!account.password) passworIssues.push(err(new Error("Password is required")));

  if (!isValidPassword(account.password)) passworIssues.push(err(new Error("Password is invalid")));

  const id = uuid();
  logger.info({ account }, "Creating account");
  const accountEntity = Account.fromCreateAccountRequest(account, id);
  const saveAccountResult = await redis.set(`${keyPrefix}${id}`, JSON.stringify(accountEntity));
  if (saveAccountResult !== "OK") return err(new Error("Unable to save account", { cause: saveAccountResult }));

  const savePasswordResult = await storePassword(account.password, id);
  if (savePasswordResult.isErr()) {
    redis.del(`${keyPrefix}${id}`);
    return err(savePasswordResult.error);
  }

  await redis.set(`${lookupPrefix}${account.email}`, id);

  const token = signToken(TokenBody.fromAccount(accountEntity));

  return ok(token);
};

export const getAccount = async (id: string): Promise<Result<Account, Error>> => {
  logger.trace({ id });
  const account = await redis.get(`${keyPrefix}${id}`);
  if (!account) return err(new Error("Account not found"));
  return ok(JSON.parse(account) as Account);
};

export const login = async (account: { email: string; password: string }): Promise<Result<string, Error>> => {
  logger.trace({ ...account });

  const id = await redis.get(`${lookupPrefix}${account.email}`);
  if (!id) return err(new Error("Account not found"));

  const accountResult = await redis.get(`${keyPrefix}${id}`);
  if (!accountResult) return err(new Error("Account not found"));

  const accountData = JSON.parse(accountResult) as Account;
  const passwordResult = await redis.get(`${keyPrefix}${id}`);
  if (!passwordResult) return err(new Error("Account not found"));

  const isValid = await verifyPassword(account.password, id);
  if (isValid.isErr()) return err(isValid.error);

  const token = signToken(TokenBody.fromAccount(accountData));

  return ok(token);
};

export const signToken = (data: TokenBody) => {
  return sign({ data }, process.env.TOKEN_SALT || "hello", { expiresIn: "1h" });
};

export const validateToken = (token: string) => {
  try {
    const { data } = verify(token, process.env.TOKEN_SALT || "hello", { maxAge: "1h" }) as JwtPayload;
    return ok(data);
  } catch (error) {
    logger.error(error);
    return err(error);
  }
};
