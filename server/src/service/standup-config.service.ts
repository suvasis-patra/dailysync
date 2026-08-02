import { prisma } from "../config/prisma";
import { NotFoundError } from "../utils/error";
import { TSetupFormValues } from "../utils/schema";
import { createSlackClient } from "../utils/slack";
import { fetchChannelMembers, fetchWorkspaceUsers } from "./slack/user.service";

export const configChannelStandup = async (data: TSetupFormValues) => {
  const { workspaceId, channelId, standupHour, standupMinute } = data;
  const workspace = await prisma.workspace.findFirst({
    where: {
      OR: [{ id: workspaceId }, { slackTeamId: workspaceId }],
    },
    select: {
      id: true,
      botToken: true,
    },
  });
  if (!workspace) {
    throw new NotFoundError(`workspace with id ${workspaceId} not found`);
  }
  const channel = await prisma.channel.findUnique({
    where: { id: channelId, workspaceId },
  });
  if (!channel) {
    throw new NotFoundError(`channel with id ${channelId} not found`);
  }
  const client = createSlackClient(workspace.botToken);
  const channelMemberIds = await fetchChannelMembers({ client, channelId });
  const workspaceUsers = await fetchWorkspaceUsers(client);
  const channelUsers = workspaceUsers.filter((user) =>
    channelMemberIds.includes(user.id as string),
  );
  const result = await prisma.$transaction(async (tx) => {
    const users = [];

    for (const slackUser of channelUsers) {
      const user = await tx.user.upsert({
        where: {
          workspaceId_slackUserId: {
            workspaceId: workspace.id,
            slackUserId: slackUser.id as string,
          },
        },
        update: {
          slackUserName: slackUser.name ?? "",
          displayName:
            slackUser.profile?.display_name ||
            slackUser.profile?.real_name ||
            slackUser.real_name ||
            slackUser.name ||
            "",
          timezone: slackUser.tz ?? null,
          isBot: slackUser.is_bot ?? false,
          isActive: !slackUser.deleted,
        },
        create: {
          workspaceId: workspace.id,
          slackUserId: slackUser.id as string,
          slackUserName: slackUser.name ?? "",
          displayName:
            slackUser.profile?.display_name ||
            slackUser.profile?.real_name ||
            slackUser.real_name ||
            slackUser.name ||
            "",
          timezone: slackUser.tz ?? null,
          isBot: slackUser.is_bot ?? false,
          isActive: !slackUser.deleted,
        },
      });

      users.push(user);
    }

    // Associate users with channel
    await tx.channelMember.createMany({
      data: users.map((user) => ({
        channelId: channel.id,
        userId: user.id,
      })),
      skipDuplicates: true,
    });

    // Create/update configuration
    const standupConfig = await tx.standupConfig.upsert({
      where: {
        channelId: channel.id,
      },
      update: {
        standupHour,
        standupMinute,
        timezone: data.timezone,
        reminderMinutes: data.reminderMinutes,
      },
      create: {
        channelId: channel.id,
        standupHour,
        standupMinute,
        timezone: data.timezone,
        reminderMinutes: data.reminderMinutes,
      },
    });

    // Replace questions
    await tx.standupQuestion.deleteMany({
      where: {
        standupConfigId: standupConfig.id,
      },
    });

    await tx.standupQuestion.createMany({
      data: data.questions.map((question, index) => ({
        standupConfigId: standupConfig.id,
        question: question.question,
        order: index + 1,
      })),
    });

    return standupConfig;
  });

  return {
    id: result.id,
    channelId: channel.id,
  };
};
