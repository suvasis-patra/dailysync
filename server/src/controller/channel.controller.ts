import { Request, Response } from "express";
import { asyncHandler } from "../utils/handler";
import { BadRequestError } from "../utils/error";
import { getChannels } from "../service/channel.service";
import { ApiResponse } from "../utils/response";

export const getWorkspaceChannels = asyncHandler(
  async (req: Request, res: Response) => {
    const workspaceId = req.params?.workspaceId as string;
    if (!workspaceId) {
      throw new BadRequestError("Workspace id missing!");
    }
    const channels = await getChannels(workspaceId);
    return ApiResponse.success(
      res,
      channels,
      `channels retrived for workspace ${workspaceId}`,
      200,
    );
  },
);
