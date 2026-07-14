import dotenv from "dotenv";

dotenv.config();

export const config = {
  PORT: Number(process.env.PORT) || 8080,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL: process.env.DATABASE_URL || "",
  SERVICE_NAME: process.env.SERVICER_NAME || "dailysync-server",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
};
