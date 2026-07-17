import dotenv from "dotenv";

dotenv.config();

export const config = {
  PORT: Number(process.env.PORT) || 8080,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL: process.env.DATABASE_URL || "",
  SERVICE_NAME: process.env.SERVICER_NAME || "dailysync-server",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  SLACK_APP_TOKEN: process.env.SLACK_APP_TOKEN || "",
  SLACK_CLIENT_ID: process.env.SLACK_CLIENT_ID || "",
  SLACK_CLIENT_SECRET: process.env.SLACK_CLIENT_SECRET || "",
  SLACK_SIGNING_SECRET: process.env.SLACK_SIGNING_SECRET || "",
  SLACK_BOT_SCOPE: process.env.SLACK_BOT_SCOPE || "",
  BACKEND_URL: process.env.BACKEND_URL || "",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
};
