import { config } from "../config";
import axios from "axios";
import {
  SlackOAuthResponse,
  SlackWorkspaceInstall,
} from "../utils/types/slack";
import { createSlackClient } from "../utils/slack";
import { fetchWorkspaceChannels } from "./channel.service";
import { saveWorkspaceWithChannels } from "./workspace.service";

export const installWorkSpace = async (code: string) => {
  // exchange the oauth code
  const install = await exchangeOauthCode(code);
  // create slack webclient
  const client = createSlackClient(install.accessToken);
  // fetch all channels
  const channels = await fetchWorkspaceChannels(client);
  // save everything
  const result = await saveWorkspaceWithChannels({ channels, install });
  // return workspace
  return result;
};

export const exchangeOauthCode = async (
  code: string,
): Promise<SlackWorkspaceInstall> => {
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
  return {
    accessToken: data.access_token,
    team: { id: data.team.id, name: data.team.name },
    botUserId: data.bot_user_id,
    installer: { slackUserId: data.authed_user.id },
  };
};
