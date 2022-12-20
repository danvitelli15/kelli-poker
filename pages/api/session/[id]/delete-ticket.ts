import { NextApiRequest, NextApiResponse } from "next";
import { validateToken } from "../../../../data/account";
import { AddTicketRequest, isOwnedByUser, removeTicketFromSession } from "../../../../data/session";

export const removeTicketHandler = async (request: NextApiRequest, response: NextApiResponse) => {
  const tokenBodyResult = validateToken(request.cookies.jwt);
  if (tokenBodyResult.isErr()) return response.status(401).json({ error: "Unauthorized" });
  const userID = tokenBodyResult.value.id;

  const isOwnerResult = await isOwnedByUser(request.query.id as string, tokenBodyResult.value.id);
  if (isOwnerResult.isErr()) return response.status(401).json({ error: isOwnerResult.error.message });

  const ticketIndex = JSON.parse(request.body);
  const addResult = await removeTicketFromSession(request.query.id as string, ticketIndex);
  if (addResult.isErr()) return response.status(400).json({ error: addResult.error.message });

  return response.status(200).json({ id: addResult.value });
};

export default removeTicketHandler;
