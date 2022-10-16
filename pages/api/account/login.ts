import { NextApiRequest, NextApiResponse } from "next";
import { login } from "../../../data/account";
import { setTokenCookie } from "../../../utils/auth";
import { loggerFactory } from "../../../utils/logger";

const logger = loggerFactory("api/account/login");

export const loginHandler = async (request: NextApiRequest, response: NextApiResponse) => {
  const account = JSON.parse(request.body);
  logger.debug({ request: account });

  const loginResult = await login(account);

  if (loginResult.isErr()) {
    logger.error(loginResult.error);
    return response.status(400).json({ error: loginResult.error.message });
  }

  setTokenCookie(response, loginResult.value);

  return response.status(200).json({ goTo: "/account/profile" });
};

export default loginHandler;
