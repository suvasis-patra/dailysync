import { Response } from "express";

export class ApiResponse {
  static success<T>(
    res: Response,
    data: T | null = null,
    message = "Success",
    statusCode = 200,
  ): Response {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static error(
    res: Response,
    message = "Internal Server Error",
    statusCode = 500,
    code = "INTERNAL_SERVER_ERROR",
    errors: unknown = null,
  ): Response {
    return res.status(statusCode).json({
      success: false,
      message,
      code,
      errors,
    });
  }
}
