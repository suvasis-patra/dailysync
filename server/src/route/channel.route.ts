import { Router } from "express";
import { getWorkspaceChannels } from "../controller/channel.controller";

export const channelRouter = Router();

channelRouter.get("/:workspaceId", getWorkspaceChannels);
