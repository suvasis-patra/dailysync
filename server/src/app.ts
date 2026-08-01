import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { reqLogger } from "./middleware/reqLogger.middleware";
import { errorMiddleware } from "./middleware/error.middleware";
import { healtCheckController } from "./controller/healt.controller";
import { authRouter } from "./route/auth.route";
import { channelRouter } from "./route/channel.route";
import { standupConfigRouter } from "./route/standup-config.route";

const app = express();

app.use(cors({ origin: ["*"] }));
app.use(cookieParser());
app.use(reqLogger);
app.use(express.json());

app.get("/health", healtCheckController);
app.use("/api/v1/slack", authRouter);
app.use("/api/v1/channel", channelRouter);
app.use("/api/v1/config", standupConfigRouter);

app.use(errorMiddleware);

export default app;
