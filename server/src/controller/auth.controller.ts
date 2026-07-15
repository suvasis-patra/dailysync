import { Request, Response } from "express";
import { asyncHandler } from "../utils/handler";
import { BadRequestError } from "../utils/error";
import { onboardNewWorkSpace } from "../service/auth.service";
import { ApiResponse } from "../utils/response";

export const onboardWorkSpace = asyncHandler(
  async (req: Request, res: Response) => {
    const code = req.query.code as string;
    const state = req.query.state as string;

    if (!code || !state) {
      throw new BadRequestError("missing code from slack");
    }
    const workspace = await onboardNewWorkSpace({ code, state });
    return ApiResponse.success(res, workspace, "new workspace added", 201);
  },
);
