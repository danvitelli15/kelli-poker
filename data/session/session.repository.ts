import { err, ok, Result } from "neverthrow";
import { v4 as uuid } from "uuid";
import { loggerFactory } from "../../utils/logger";
import { redis } from "../database-connection";
import { CreateSessionRequest } from "./create-session-request.dto";
import { Session } from "./session.entity";

const logger = loggerFactory("session.repository");

const keyPrefix = "session:";
const userLookupPrefix = "lookup:session:user:";

export const createSession = async (
  sessionRequest: CreateSessionRequest,
  userID: string
): Promise<Result<string, Error>> => {
  logger.trace({ ...sessionRequest, userID });
  if (!sessionRequest.title) return err(new Error("Title is required"));
  if (!sessionRequest.date) return err(new Error("Date is required"));

  const id = uuid();
  logger.info({ sessionRequest }, "Creating session");
  const sessionEntity = Session.fromCreateSessionRequest({ tickets: [], ...sessionRequest }, id, userID);
  const saveSessionResult = await redis.set(`${keyPrefix}${id}`, JSON.stringify(sessionEntity));
  if (saveSessionResult !== "OK") return err(new Error("Unable to save session"));

  const saveLookupResult = await redis.sadd(`${userLookupPrefix}${userID}`, id);
  if (saveLookupResult !== 1) {
    redis.del(`${keyPrefix}${id}`);
    return err(new Error("Unable to save session"));
  }

  return ok(sessionEntity.id);
};
