import mongoose from "mongoose";
import { env } from "./env";
import logger, { logError } from "./logger";

const connectDB = async () => {
    try {
        await mongoose.connect(env.MONGO_URI);
        logger.info("DB Connected via prisma");
    } catch (error) {
        logError("Database Connection error:", error);
        process.exit(1);
    }
}

const disconnectDB = async () => {
    await mongoose.disconnect();
    logger.info("DB Disconnected");
}

export { connectDB, disconnectDB, };