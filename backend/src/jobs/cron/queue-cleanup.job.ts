import cron from "node-cron";
import { emailQueue } from "../../queues/email.queue.js";
import logger, { logError } from "../../config/logger.js";

cron.schedule("0 * * * *", async () => {
    try {

        // Delete up to 100 completed jobs that finished more than 60 seconds ago.
        await emailQueue.clean(60000, 1000, 'completed');

        // Delete up to 100 failed jobs that finished more than 300000ms (5 min) ago.
        await emailQueue.clean(300000, 100, 'failed');

        logger.info("Email queue cleaned");
    } catch (error) {
        logError("Failed to clean email queue:", error);
    }
}, {
    timezone: 'Asia/Kathmandu'
})