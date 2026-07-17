import crypto from "node:crypto";
import { Request, Response } from "express";

import { config } from "../config/index";
import { asyncHandler } from "../utils/handler";
import { ApiResponse } from "../utils/response";
import { BadRequestError } from "../utils/error";
import { onboardNewWorkSpace } from "../service/auth.service";

export const onboardWorkSpace = asyncHandler(
  async (req: Request, res: Response) => {
    const code = req.query.code as string;
    const state = req.query.state as string;
    const cookieState = req.cookies?.slack_auth_state as string;

    res.clearCookie("slack_auth_state");

    if (!code || !state) {
      throw new BadRequestError("missing code from slack");
    }
    if (!cookieState || state !== cookieState) {
      throw new BadRequestError("CSRF verification failed: state mismatch");
    }
    await onboardNewWorkSpace({ code, state });
    return res.redirect(config.FRONTEND_URL);
  },
);

export const initiateSlackAuth = asyncHandler(
  async (_req: Request, res: Response) => {
    const state = crypto.randomBytes(16).toString("hex");
    res.cookie("slack_auth_state", state, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      maxAge: 10 * 60 * 1000,
      sameSite: "lax",
    });
    const scope = config.SLACK_BOT_SCOPE;
    const slackAuthUrl = new URL("https://slack.com/oauth/v2/authorize");
    slackAuthUrl.searchParams.set("client_id", config.SLACK_CLIENT_ID);
    slackAuthUrl.searchParams.set("scope", scope);
    slackAuthUrl.searchParams.set("state", state);
    const redirectUri = `${config.BACKEND_URL.replace(/\/$/, "")}/api/v1/slack/oauth_redirect`;
    slackAuthUrl.searchParams.set("redirect_uri", redirectUri);
    res.redirect(slackAuthUrl.toString());
  },
);
