import { NextApiRequest, NextApiResponse } from "next";
import { validateToken } from "../../../data/account";
import { getSessionsForUser } from "../../../data/session";

export const SessionsByUserHandler = async (request: NextApiRequest, response: NextApiResponse) => {
  const tokenBodyResult = validateToken(request.cookies.jwt);
  if (tokenBodyResult.isErr()) return response.status(401).json({ error: "Unauthorized" });

  const sessionsResult = await getSessionsForUser(tokenBodyResult.value.id);
  if (sessionsResult.isErr()) return response.status(400).json({ error: sessionsResult.error.message });

  return response.status(200).json(sessionsResult.value);
};

export default SessionsByUserHandler;
