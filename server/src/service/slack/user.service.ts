import { WebClient } from "@slack/web-api";

export const fetchChannelMembers = async ({
  client,
  channelId,
}: {
  client: WebClient;
  channelId: string;
}): Promise<string[]> => {
  const members: string[] = [];

  let cursor: string | undefined;

  do {
    const response = await client.conversations.members({
      channel: channelId,
      limit: 1000,
      cursor,
    });

    if (!response.ok) {
      throw new Error(response.error ?? "Failed to fetch channel members");
    }

    if (response.members) {
      members.push(...response.members);
    }

    cursor = response.response_metadata?.next_cursor || undefined;
  } while (cursor);

  return members;
};

export const fetchWorkspaceUsers = async (client: WebClient) => {
  const users = [];
  let cursor: string | undefined;

  do {
    const response = await client.users.list({
      limit: 200,
      cursor,
    });

    if (!response.ok) {
      throw new Error(response.error ?? "Failed to fetch workspace users");
    }

    if (response.members) {
      users.push(...response.members);
    }

    cursor = response.response_metadata?.next_cursor || undefined;
  } while (cursor);

  return users;
};
