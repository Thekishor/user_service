import dotenv from "dotenv";
import { connectToDB } from "./config/database";
import http from "node:http";
import app from "./app";
import { env } from "./config/env";
import logger, { logError } from "./config/logger";

dotenv.config();

async function startServer() {

  await connectToDB();

  const server = http.createServer(app);

  server.listen(process.env.PORT, () => {
    logger.info(`Server is running to port ${env.PORT}`);

  });
}

startServer().catch(err => {
  logError("Error occurs while starting the server", err);
  process.exit(1);
})