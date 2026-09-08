import dotenv from "dotenv";
import { createServer } from "node:http";
import { createApp } from "./app.js";
import { env } from "./config/env.js";
import logger, { logError } from "./config/logger.js";
import { connectRedis, disconnectRedis } from "./config/redis.config.js";
import { createRateLimiters } from "./config/rate-limiter.js";
import { connectDB, disconnectDB } from "./config/database.js";
import dns from 'node:dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);

dotenv.config();

await connectDB();
await connectRedis();

const rateLimiters = createRateLimiters();
const app = createApp(rateLimiters);

const httpServer = createServer(app);

const PORT = env.PORT || 5000;

const server = httpServer.listen(PORT, () => {
  logger.info("Server started on port", { port: PORT });
});

// shutdown helper
async function shutdown(code: number) {
  logger.info("Closing connections...");
  server.close();
  await disconnectDB();
  await disconnectRedis();
  process.exit(code);
}

process.on("SIGTERM", () => shutdown(0));
process.on("SIGINT", () => shutdown(0));

// Handle unhandled promise rejections (e.g database connection errors)
process.on("unhandledRejection", (err) => {
  logError("Unhandled Rejection:", err);
  shutdown(1);
});

// Handles unexpected sync errors (like undefined variable, crash).
process.on("uncaughtException", async (err) => {
  logError("Uncaught Exception:", err);
  shutdown(1);
});