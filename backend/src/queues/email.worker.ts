import { Worker } from "bullmq";
import { redis } from "../config/redis.config.js";
import { resetPasswordTemplate, verifyEmailTemplate } from "../utils/templates";
import { sendEmail } from "../config/mail.config";
import logger, { logError } from "../config/logger";

const worker = new Worker(
    "email",
    async (job) => {

        // for register email verification 
        if (job.name === "send-verification-email") {
            const html = verifyEmailTemplate(job.data.verifyUrl);

            await sendEmail(
                job.data.email,
                "Verify Your Email Address",
                html,
            );

            logger.info(`Verification email sent to ${job.data.email}`);
        }


        // for reset password verification mail
        if (job.name === "send-reset-password-email") {
            const html = resetPasswordTemplate(job.data.resetPasswordLink);

            await sendEmail(
                job.data.email,
                "Reset Password",
                html
            );
        }
    },
    {
        connection: redis,
    },
);

worker.on("completed", (job) => {
    logger.info(`Job ${job.id} completed`);
});

worker.on("failed", (job, error) => {
    logError(`Job ${job?.id} failed:`, error);
});