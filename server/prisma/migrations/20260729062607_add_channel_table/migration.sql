/*
  Warnings:

  - You are about to drop the column `workspaceId` on the `StandupConfig` table. All the data in the column will be lost.
  - You are about to drop the column `workspaceId` on the `StandupSession` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[channelId]` on the table `StandupConfig` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[order]` on the table `StandupQuestion` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[standupConfigId,order]` on the table `StandupQuestion` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[standupConfigId,scheduledDate]` on the table `StandupSession` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `standupConfigId` to the `StandupSession` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "StandupConfig" DROP CONSTRAINT "StandupConfig_workspaceId_fkey";

-- DropForeignKey
ALTER TABLE "StandupSession" DROP CONSTRAINT "StandupSession_workspaceId_fkey";

-- DropIndex
DROP INDEX "StandupConfig_workspaceId_key";

-- DropIndex
DROP INDEX "StandupSession_workspaceId_idx";

-- DropIndex
DROP INDEX "StandupSession_workspaceId_scheduledDate_key";

-- DropIndex
DROP INDEX "StandupSummary_sessionId_idx";

-- AlterTable
ALTER TABLE "StandupConfig" DROP COLUMN "workspaceId",
ALTER COLUMN "reminderMinutes" DROP NOT NULL,
ALTER COLUMN "reminderMinutes" DROP DEFAULT;

-- AlterTable
ALTER TABLE "StandupSession" DROP COLUMN "workspaceId",
ADD COLUMN     "standupConfigId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Channel" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "slackChannelId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isPrivate" BOOLEAN NOT NULL,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "isMember" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChannelMember" (
    "channelId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChannelMember_pkey" PRIMARY KEY ("channelId","userId")
);

-- CreateIndex
CREATE INDEX "Channel_workspaceId_idx" ON "Channel"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_workspaceId_slackChannelId_key" ON "Channel"("workspaceId", "slackChannelId");

-- CreateIndex
CREATE INDEX "ChannelMember_userId_idx" ON "ChannelMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "StandupConfig_channelId_key" ON "StandupConfig"("channelId");

-- CreateIndex
CREATE UNIQUE INDEX "StandupQuestion_order_key" ON "StandupQuestion"("order");

-- CreateIndex
CREATE UNIQUE INDEX "StandupQuestion_standupConfigId_order_key" ON "StandupQuestion"("standupConfigId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "StandupSession_standupConfigId_scheduledDate_key" ON "StandupSession"("standupConfigId", "scheduledDate");

-- AddForeignKey
ALTER TABLE "Channel" ADD CONSTRAINT "Channel_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChannelMember" ADD CONSTRAINT "ChannelMember_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChannelMember" ADD CONSTRAINT "ChannelMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandupConfig" ADD CONSTRAINT "StandupConfig_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandupSession" ADD CONSTRAINT "StandupSession_standupConfigId_fkey" FOREIGN KEY ("standupConfigId") REFERENCES "StandupConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;
