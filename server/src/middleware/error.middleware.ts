import { NextFunction, Request, Response } from "express";

import { AppError } from "../utils/error";
import { ApiResponse } from "../utils/response";
import { logger } from "../config/logger";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.error({
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    statusCode: err instanceof AppError ? err.statusCode : 500,
    code: err instanceof AppError ? err.code : "INTERNAL_SERVER_ERROR",
    message: err.message,
    stack: err.stack,
  });
  if (err instanceof AppError) {
    return ApiResponse.error(res, err.message, err.statusCode, err.code);
  }
  return ApiResponse.error(
    res,
    "Something went wrong",
    500,
    "INTERNAL_SERVER_ERROR",
  );
};
