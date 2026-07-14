import express from "express";
import cors from "cors";
import { reqLogger } from "./middleware/reqLogger.middleware";
import { errorMiddleware } from "./middleware/error.middleware";
import { healtCheckController } from "./controller/healt.controller";

const app = express();

app.use(cors());
app.use(reqLogger);
app.use(express.json());

app.get("/health", healtCheckController);

app.use(errorMiddleware);

export default app;
