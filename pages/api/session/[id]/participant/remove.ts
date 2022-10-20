import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuid } from "uuid";
import { registerParticipant, removeParticipant } from "../../../../../data/session";

export const addParticipantHandler = async (request: NextApiRequest, response: NextApiResponse) => {
  let name = request.cookies.sessionName;

  const removeResult = await removeParticipant(request.query.id as string, name);
  if (removeResult.isErr()) return response.status(404).json({ error: removeResult.error.message });

  return response.status(200).send(true);
};

export default addParticipantHandler;
