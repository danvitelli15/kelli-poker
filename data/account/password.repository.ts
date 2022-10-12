import bcrypt from "bcrypt";
import { err, ok, Result } from "neverthrow";
import { redis } from "../database-connection";

const keyPrefix = "password:";
const saltRounds = 10;

export const isValidPassword = (password: string): boolean => true;

export const hashPassword = async (password: string): Promise<Result<string, Error>> => {
  return new Promise<Result<string, Error>>((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (e, hash) => {
      if (e) reject(err(e));
      else resolve(ok(hash));
    });
  });
};

export const storePassword = async (password: string, userID: string): Promise<Result<string, Error>> => {
  const hashResult = await hashPassword(password);
  if (hashResult.isErr()) return hashResult;

  const result = await redis.set(`${keyPrefix}${userID}`, hashResult.value);
  if (result === "OK") return ok(hashResult.value);
  else return err(new Error("Unable to store password"));
};
