import { Request, Response } from "express";
import { config } from "../config/index";

export const healtCheckController = (_: Request, res: Response) => {
  return res
    .status(201)
    .json({ message: "OK", serviceName: config.SERVICE_NAME });
};
