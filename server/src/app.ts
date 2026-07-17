import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { reqLogger } from "./middleware/reqLogger.middleware";
import { errorMiddleware } from "./middleware/error.middleware";
import { healtCheckController } from "./controller/healt.controller";
import { authRouter } from "./route/auth.route";

const app = express();

app.use(cors({ origin: ["*"] }));
app.use(cookieParser());
app.use(reqLogger);
app.use(express.json());

app.use("/api/v1/slack", authRouter);
app.get("/health", healtCheckController);

app.use(errorMiddleware);

export default app;
