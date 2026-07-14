-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');

-- CreateTable
CREATE TABLE "Workspace" (
    "id" TEXT NOT NULL,
    "slackTeamId" TEXT NOT NULL,
    "slackTeamName" TEXT NOT NULL,
    "botToken" TEXT NOT NULL,
    "botUserId" TEXT NOT NULL,
    "installedBySlackUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "slackUserId" TEXT NOT NULL,
    "slackUserName" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "timezone" TEXT,
    "isBot" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StandupConfig" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "standupHour" INTEGER NOT NULL,
    "standupMinute" INTEGER NOT NULL,
    "timezone" TEXT NOT NULL,
    "reminderMinutes" INTEGER NOT NULL DEFAULT 30,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StandupConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StandupQuestion" (
    "id" TEXT NOT NULL,
    "standupConfigId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StandupQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StandupSession" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "status" "SessionStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StandupSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StandupResponse" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StandupResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" TEXT NOT NULL,
    "responseId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StandupSummary" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StandupSummary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_slackTeamId_key" ON "Workspace"("slackTeamId");

-- CreateIndex
CREATE INDEX "Workspace_slackTeamId_idx" ON "Workspace"("slackTeamId");

-- CreateIndex
CREATE INDEX "User_workspaceId_idx" ON "User"("workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "User_workspaceId_slackUserId_key" ON "User"("workspaceId", "slackUserId");

-- CreateIndex
CREATE UNIQUE INDEX "StandupConfig_workspaceId_key" ON "StandupConfig"("workspaceId");

-- CreateIndex
CREATE INDEX "StandupQuestion_standupConfigId_idx" ON "StandupQuestion"("standupConfigId");

-- CreateIndex
CREATE INDEX "StandupSession_workspaceId_idx" ON "StandupSession"("workspaceId");

-- CreateIndex
CREATE INDEX "StandupSession_scheduledDate_idx" ON "StandupSession"("scheduledDate");

-- CreateIndex
CREATE UNIQUE INDEX "StandupSession_workspaceId_scheduledDate_key" ON "StandupSession"("workspaceId", "scheduledDate");

-- CreateIndex
CREATE INDEX "StandupResponse_sessionId_idx" ON "StandupResponse"("sessionId");

-- CreateIndex
CREATE INDEX "StandupResponse_userId_idx" ON "StandupResponse"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "StandupResponse_sessionId_userId_key" ON "StandupResponse"("sessionId", "userId");

-- CreateIndex
CREATE INDEX "Answer_responseId_idx" ON "Answer"("responseId");

-- CreateIndex
CREATE INDEX "Answer_questionId_idx" ON "Answer"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "StandupSummary_sessionId_key" ON "StandupSummary"("sessionId");

-- CreateIndex
CREATE INDEX "StandupSummary_sessionId_idx" ON "StandupSummary"("sessionId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandupConfig" ADD CONSTRAINT "StandupConfig_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandupQuestion" ADD CONSTRAINT "StandupQuestion_standupConfigId_fkey" FOREIGN KEY ("standupConfigId") REFERENCES "StandupConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandupSession" ADD CONSTRAINT "StandupSession_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandupResponse" ADD CONSTRAINT "StandupResponse_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "StandupSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandupResponse" ADD CONSTRAINT "StandupResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "StandupResponse"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "StandupQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StandupSummary" ADD CONSTRAINT "StandupSummary_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "StandupSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
