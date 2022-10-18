import { NextApiRequest, NextApiResponse } from "next";
import { setActiveTicket } from "../../../../../data/session";

export const setSessionActiveTicketHandler = async (request: NextApiRequest, response: NextApiResponse) => {
  const { id, index } = request.query;
  setActiveTicket(id as string, parseInt(index as string, 10));
  return response.status(200).send(true);
};

export default setSessionActiveTicketHandler;
