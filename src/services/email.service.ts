import { Resend } from 'resend';
import { env } from '../config/env';
import logger, { logError } from '../config/logger';

const resend = new Resend(env.RESEND_API_KEY);  

export async function sendEmail(to: string, subject: string, html: string) {
    
    try {
        const { data, error } = await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: [to],
            subject: subject,
            html: html,
        });

        if (error) {
            logError("Failed to send email", error);
            return { success: false };
        }

        logger.info("Email sent successfully", {data});
        return { success: true };

    } catch(error) {
        logError("Failed to send email", error);
        return { success: false };
    }
}