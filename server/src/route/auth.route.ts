import { Router } from "express";
import { onboardWorkSpace } from "../controller/auth.controller";

export const authRouter = Router();

authRouter.post("/oauth_redirect", onboardWorkSpace);
