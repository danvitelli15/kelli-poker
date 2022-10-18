import { err, ok, Result } from "neverthrow";
import { v4 as uuid } from "uuid";
import { loggerFactory } from "../../utils/logger";
import { redis } from "../database-connection";
import { AddTicketRequest, CreateSessionRequest } from "./create-session-request.dto";
import { Session, Ticket } from "./session.entity";

const logger = loggerFactory("session.repository");

const keyPrefix = "session:";
const userLookupPrefix = "lookup:session:user:";

const saveSession = async (session: Session): Promise<Result<"OK", Error>> => {
  const result = await redis.set(`${keyPrefix}${session.id}`, JSON.stringify(session));
  if (result !== "OK") return err(new Error("Failed to save session"));
  return ok(result);
};

export const addTicketToSession = async (sessionID: string, ticket: AddTicketRequest): Promise<Result<"OK", Error>> => {
  const session = await getSession(sessionID);
  if (session.isErr()) return err(session.error);
  session.value.tickets.push(Ticket.fromAddTicketRequest(ticket));
  const saveResult = await saveSession(session.value);
  if (saveResult.isErr()) return err(saveResult.error);
  return ok(saveResult.value);
};

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

export const getSession = async (id: string): Promise<Result<Session, Error>> => {
  logger.trace({ id });
  const sessionResult = await redis.get(`${keyPrefix}${id}`);
  if (!sessionResult) return err(new Error("Session not found"));
  const session = JSON.parse(sessionResult) as Session;
  return ok(session);
};

export const getSessionsForUser = async (userID: string): Promise<Result<Session[], Error>> => {
  logger.trace({ userID });
  const sessionIDsResult = await redis.smembers(`${userLookupPrefix}${userID}`);
  if (!sessionIDsResult) return err(new Error("Unable to get sessions"));
  const sessionsIDs = sessionIDsResult.map((id) => `${keyPrefix}${id}`);
  if (!sessionsIDs || sessionsIDs.length <= 0) return ok([]);

  const sessionsResults = await redis.mget(...sessionsIDs);
  if (!sessionsResults) return err(new Error("Unable to get sessions"));

  const sessions = sessionsResults.map((session) => (session !== "nil" ? (JSON.parse(session) as Session) : null));
  return ok(sessions.filter((i) => i !== null));
};

export const isOwnedByUser = async (sessionID: string, userID: string): Promise<Result<boolean, Error>> => {
  logger.trace({ sessionID, userID });
  const session = await redis.get(`${keyPrefix}${sessionID}`);
  if (!session) return err(new Error("Session not found"));

  const sessionEntity = JSON.parse(session) as Session;
  return ok(sessionEntity.owner === userID);
};

export const setActiveTicket = async (sessionID: string, ticketIndex: number): Promise<Result<"OK", Error>> => {
  const session = await getSession(sessionID);
  if (session.isErr()) return err(session.error);

  session.value.activeTicketIndex = ticketIndex;

  const saveResult = await saveSession(session.value);
  if (saveResult.isErr()) return err(saveResult.error);
  return ok(saveResult.value);
};
