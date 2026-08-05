import { Resend } from 'resend';
import { env } from '../config/env';

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
            console.log("Failed to send email", error.message);
            return { success: false };
        }

        console.log("Email sent successfully", data);
        return { success: true };

    } catch(error) {
        console.log("Failed to send email", error);
        return { success: false };
    }
}