import { Request, Response } from "express";
import { asyncHandler } from "../utils/handler";
import { ZSetupSchema } from "../utils/schema";
import { ValidationError } from "../utils/error";
import { configChannelStandup } from "../service/standup-config.service";
import { ApiResponse } from "../utils/response";

export const configStandup = asyncHandler(
  async (req: Request, res: Response) => {
    const parsedData = ZSetupSchema.safeParse(req.body);
    if (!parsedData.success) {
      throw new ValidationError("Invalid stand up configuration");
    }
    const result = await configChannelStandup(parsedData.data);
    return ApiResponse.success(res, { ...result }, "success", 201);
  },
);
