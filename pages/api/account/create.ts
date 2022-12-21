import { ok } from "assert";
import { NextApiRequest, NextApiResponse } from "next";
import { createAccount } from "../../../data/account";
import { setTokenCookie } from "../../../utils/auth";
import { loggerFactory } from "../../../utils/logger";

const logger = loggerFactory("api/account/create");

export const createAccountHandler = async (request: NextApiRequest, response: NextApiResponse) => {
  const account = JSON.parse(request.body);
  logger.debug({ request: account });

  const createResult = await createAccount(account);

  if (createResult.isErr()) {
    logger.error(createResult.error);
    return response.status(400).json({ error: createResult.error.message });
  }

  setTokenCookie(response, createResult.value);

  return response.status(200).json({ goTo: "/account/profile" });
};

export default createAccountHandler;
