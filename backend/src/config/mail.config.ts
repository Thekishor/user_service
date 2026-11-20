import { Resend } from 'resend';
import { env } from './env.js';
import logger, { logError } from './logger.js';

const resend = new Resend(env.RESEND_API_KEY);

export async function sendEmail(to: string, subject: string, html: string) {

    try {
        const { data, error } = await resend.emails.send({
            from: env.DOMAIN,
            to: [to],
            subject: subject,
            html: html,
        });

        if (error) {
            logError("Failed to send email to user", error);
            return { success: false };
        }

        logger.info("Email sent successfully to user", { data });
        return { success: true };

    } catch (error) {
        logError("Fail to send email to user", error);
        return { success: false };
    }
}