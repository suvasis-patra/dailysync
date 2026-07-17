import axios from "axios";

import { config } from "../config/index";
import { prisma } from "../config/prisma";
import { SlackOAuthResponse } from "../utils/types/slack";

export const onboardNewWorkSpace = async ({
  code,
  state,
}: {
  code: string;
  state: string;
}) => {
  try {
    const redirectUri = `${config.BACKEND_URL.replace(/\/$/, "")}/api/v1/slack/oauth_redirect`;
    const response = await axios.post(
      "https://slack.com/api/oauth.v2.access",
      new URLSearchParams({
        client_id: config.SLACK_CLIENT_ID,
        client_secret: config.SLACK_CLIENT_SECRET,
        code,
        redirect_uri: redirectUri,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    const data = response.data as SlackOAuthResponse;
    if (!data.ok) {
      throw new Error(
        data.error || "Failed to retrieve Slack OAuth access token",
      );
    }

    const workspace = await prisma.workspace.upsert({
      where: {
        slackTeamId: data.team.id,
      },
      update: {
        slackTeamName: data.team.name,
        botToken: data.access_token,
        botUserId: data.bot_user_id,
        installedBySlackUserId: data.authed_user.id,
      },
      create: {
        slackTeamId: data.team.id,
        slackTeamName: data.team.name,
        botToken: data.access_token,
        botUserId: data.bot_user_id,
        installedBySlackUserId: data.authed_user.id,
      },
      select: {
        id: true,
        slackTeamId: true,
        slackTeamName: true,
        botUserId: true,
        installedBySlackUserId: true,
        createdAt: true,
      },
    });

    return workspace;
  } catch (error) {
    throw error;
  }
};
