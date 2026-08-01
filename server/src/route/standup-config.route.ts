import { Router } from "express";
import { configStandup } from "../controller/standup-config.controller";

export const standupConfigRouter = Router();

standupConfigRouter.post("/", configStandup);
