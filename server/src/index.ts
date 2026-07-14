import { IncomingMessage, Server, ServerResponse } from "node:http";

import app from "./app";
import { config } from "./config/index";
import { logger } from "./config/logger";

const PORT = config.PORT;

let server: Server<typeof IncomingMessage, typeof ServerResponse> | null = null;

async function startServer() {
  try {
    server = app.listen(PORT, () => {
      logger.info(`server started at http://localhost:${PORT}`);
    });
    server.on("listening", () =>
      logger.info("server ready to process request"),
    );
    server.on("error", (err) => {
      logger.error("server error", err);
      process.exit(1);
    });
  } catch (error) {
    logger.error("failed to start server", error);
    process.exit(1);
  }
}

startServer();
