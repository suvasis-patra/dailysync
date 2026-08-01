import { prisma } from "../config/prisma";
import { SlackChannel, SlackWorkspaceInstall } from "../utils/types/slack";

export const saveWorkspaceWithChannels = async ({
  channels,
  install,
}: {
  channels: SlackChannel[];
  install: SlackWorkspaceInstall;
}) => {
  return prisma.$transaction(async (tx) => {
    const workspace = await tx.workspace.upsert({
      where: {
        slackTeamId: install.team.id,
      },
      update: {
        slackTeamName: install.team.name,
        botToken: install.accessToken,
        botUserId: install.botUserId,
        installedBySlackUserId: install.installer.slackUserId,
      },
      create: {
        slackTeamId: install.team.id,
        slackTeamName: install.team.name,
        botToken: install.accessToken,
        botUserId: install.botUserId,
        installedBySlackUserId: install.installer.slackUserId,
      },
      select: {
        id: true,
        slackTeamId: true,
        slackTeamName: true,
        botUserId: true,
        installedBySlackUserId: true,
      },
    });

    // Remove old channel cache
    await tx.channel.deleteMany({
      where: {
        workspaceId: workspace.id,
      },
    });

    // Insert fresh channels
    if (channels.length > 0) {
      await tx.channel.createMany({
        data: channels.map((channel) => ({
          workspaceId: workspace.id,
          slackChannelId: channel.slackChannelId,
          name: channel.name,
          isPrivate: channel.isPrivate,
          isArchived: channel.isArchived,
          isMember: channel.isMember,
        })),
      });
    }

    return workspace;
  });
};
