import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuid } from "uuid";
import { registerParticipant } from "../../../../../data/session";

export const addParticipantHandler = async (request: NextApiRequest, response: NextApiResponse) => {
  let name = request.cookies.sessionName;
  if (!name) {
    name = uuid().split("-")[0];
    response.setHeader(
      "Set-Cookie",
      serialize("jwt", name, {
        httpOnly: true,
        sameSite: "lax",
        domain: process.env.COOKIE_DOMAIN,
        path: "/",
      })
    );
  }

  const registerResult = await registerParticipant(request.query.id as string, name);
  if (registerResult.isErr()) return response.status(404).json({ error: registerResult.error.message });

  return response.status(200).send(true);
};

export default addParticipantHandler;
