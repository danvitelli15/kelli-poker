import { serialize } from "cookie";
import { NextApiResponse } from "next";

export const setTokenCookie = (response: NextApiResponse, token: string) =>
  response.setHeader(
    "Set-Cookie",
    serialize("jwt", token, {
      httpOnly: true,
      sameSite: "lax",
      domain: process.env.COOKIE_DOMAIN,
      path: "/",
    })
  );
