import crypto from "node:crypto";
import { Request, Response } from "express";

import { config } from "../config/index";
import { asyncHandler } from "../utils/handler";
import { installWorkSpace } from "../service/oauth.service";

export const onboardWorkSpace = asyncHandler(
  async (req: Request, res: Response) => {
    const code = req.query.code as string;
    const state = req.query.state as string;
    const cookieState = req.cookies?.slack_auth_state as string;

    res.clearCookie("slack_auth_state");

    const frontendBaseUrl = config.FRONTEND_URL.replace(/\/$/, "");
    const redirectUrl = new URL(`${frontendBaseUrl}/oauth-status`);

    if (!code || !state) {
      redirectUrl.searchParams.set("oauth", "error");
      redirectUrl.searchParams.set("message", "Missing Slack OAuth code");
      return res.redirect(redirectUrl.toString());
    }

    if (!cookieState || state !== cookieState) {
      redirectUrl.searchParams.set("oauth", "error");
      redirectUrl.searchParams.set("message", "CSRF verification failed");
      return res.redirect(redirectUrl.toString());
    }

    try {
      const result = await installWorkSpace(code);
      redirectUrl.searchParams.set("oauth", "success");
      redirectUrl.searchParams.set("workspaceId", result.slackTeamId);
      return res.redirect(redirectUrl.toString());
    } catch (error) {
      redirectUrl.searchParams.set("oauth", "error");
      redirectUrl.searchParams.set(
        "message",
        error instanceof Error
          ? error.message
          : "Slack workspace installation failed",
      );
      return res.redirect(redirectUrl.toString());
    }
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
