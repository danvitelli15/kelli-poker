import { NextApiRequest, NextApiResponse } from "next";

export const createAccountHandler = (request: NextApiRequest, response: NextApiResponse) => {
  response.status(200).send(0);
};
