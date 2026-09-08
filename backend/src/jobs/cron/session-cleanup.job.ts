import corn from "node-cron";
import logger, { logError } from "../../config/logger.js";
import { Session } from "../../models/session.model.js";

//runs at 1:5 pm every day
corn.schedule('5 13 * * *', async () => {
    try {
        logger.info("Session cleanup job executed at:", new Date());

        const now = new Date();

        await Session.deleteMany({
            revoked: true,
            updatedAt: {
                $lt: new Date(now.getTime() - 1 * 60 * 60 * 1000)
            }
        });

    } catch (error) {
        logError("Failed to delete revoked/expired sessions", error);
    }
}, {
    timezone: 'Asia/Kathmandu'
})