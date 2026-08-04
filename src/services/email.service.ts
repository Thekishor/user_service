import { Resend } from 'resend';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';

const resend = new Resend(env.RESEND_API_KEY);  

export async function sendEmail(to: string, subject: string, html: string) {

    const emailFrom = env.EMAIL_FROM;

    if (!emailFrom) {
        throw new AppError("Domain not found", 404);
    }
    
    try {
        const { data, error } = await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: [to],
            subject: subject,
            html: html,
        });

        if (error) {
            console.log("Failed to send email", error.message);
            return { success: false };
        }

        console.log("Email sent successfully", data);
        return { success: true, data };

    } catch(error) {
        return { success: false };
    }
}