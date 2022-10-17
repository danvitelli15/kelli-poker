import { NextApiRequest, NextApiResponse } from "next";
import { validateToken } from "../../../data/account";
import { createSession } from "../../../data/session";

export const createSessionHandler = async (request: NextApiRequest, response: NextApiResponse) => {
  const tokenBodyResult = validateToken(request.cookies.jwt);
  if (tokenBodyResult.isErr()) return response.status(401).json({ error: "Unauthorized" });
  const userID = tokenBodyResult.value.id;

  const sessionRequest = JSON.parse(request.body);
  const createResult = await createSession(sessionRequest, userID);
  if (createResult.isErr()) return response.status(400).json({ error: createResult.error.message });

  return response.status(200).json({ id: createResult.value });
};

export default createSessionHandler;
