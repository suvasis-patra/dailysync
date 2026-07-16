import { Router } from "express";
import {
  initiateSlackAuth,
  onboardWorkSpace,
} from "../controller/auth.controller";

export const authRouter = Router();

authRouter.post("/oauth_redirect", onboardWorkSpace);
authRouter.get("/auth", initiateSlackAuth);
