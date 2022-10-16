import { ok } from "assert";
import { NextApiRequest, NextApiResponse } from "next";
import { createAccount } from "../../../data/account";
import { loggerFactory } from "../../../utils/logger";

const logger = loggerFactory("api/account/create");

export const createAccountHandler = async (request: NextApiRequest, response: NextApiResponse) => {
  logger.debug({ request: request.body });

  const createResult = await createAccount(request.body);

  if (createResult.isErr()) {
    logger.error(createResult.error);
    return response.status(400).json({ error: createResult.error.message });
  }

  // response.redirect(303, "/account/profile");
  response.status(200).json({ message: "Account created" });
};

export default createAccountHandler;
