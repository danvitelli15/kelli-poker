import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "../../../../data/session";
import { loggerFactory } from "../../../../utils/logger";

const logger = loggerFactory("api/session/[id]");

export const setSessionHandler = async (request: NextApiRequest, response: NextApiResponse) => {
  logger.debug({ request: request.query.id });

  const sessionResult = await getSession(request.query.id as string);
  if (sessionResult.isErr()) return response.status(404).json({ error: sessionResult.error.message });

  return response.status(200).json(sessionResult.value);
};

export default setSessionHandler;
