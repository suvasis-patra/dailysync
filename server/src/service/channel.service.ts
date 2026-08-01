import { WebClient } from "@slack/web-api";

import { SlackChannel } from "../utils/types/slack";
import { prisma } from "../config/prisma";

export const fetchWorkspaceChannels = async (
  client: WebClient,
): Promise<SlackChannel[]> => {
  const channels: SlackChannel[] = [];

  let cursor: string | undefined;

  do {
    const response = await client.conversations.list({
      types: "public_channel,private_channel",
      exclude_archived: false,
      limit: 1000,
      cursor,
    });

    if (!response.ok) {
      throw new Error(response.error ?? "Failed to fetch Slack channels");
    }

    for (const channel of response.channels ?? []) {
      if (!channel.id || !channel.name) {
        continue;
      }

      channels.push({
        slackChannelId: channel.id,
        name: channel.name,
        isPrivate: channel.is_private ?? false,
        isArchived: channel.is_archived ?? false,
        isMember: channel.is_member ?? false,
      });
    }

    cursor = response.response_metadata?.next_cursor || undefined;
  } while (cursor);

  return channels;
};

export const getChannels = async (workspaceId: string) => {
  try {
    const channels = await prisma.channel.findMany({
      where: { workspaceId },
      orderBy: { name: "asc" },
    });
    return channels;
  } catch (error) {
    throw error;
  }
};
