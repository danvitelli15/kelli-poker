import { NextApiRequest, NextApiResponse } from "next";
import { validateToken } from "../../../../data/account";
import { AddTicketRequest, addTicketToSession, isOwnedByUser } from "../../../../data/session";

export const addTicketHandler = async (request: NextApiRequest, response: NextApiResponse) => {
  const tokenBodyResult = validateToken(request.cookies.jwt);
  if (tokenBodyResult.isErr()) return response.status(401).json({ error: "Unauthorized" });
  const userID = tokenBodyResult.value.id;

  const isOwnerResult = await isOwnedByUser(request.query.id as string, tokenBodyResult.value.id);
  if (isOwnerResult.isErr()) return response.status(401).json({ error: isOwnerResult.error.message });

  const ticketRequest = JSON.parse(request.body) as AddTicketRequest;
  const addResult = await addTicketToSession(request.query.id as string, ticketRequest);
  if (addResult.isErr()) return response.status(400).json({ error: addResult.error.message });

  return response.status(200).json({ id: addResult.value });
};

export default addTicketHandler;
