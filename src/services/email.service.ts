import nodemailer from 'nodemailer';
import {env} from "../config/env"

export async function sendEmail(to: string, subject: string, html: string) {

    const from = env.EMAIL_FROM;

    const transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: Number(env.SMTP_PORT),
        secure: false,
        auth: {
            user: env.SMTP_USER,
            pass: env.SMTP_PASS
        }
    });

    await transporter.sendMail({from, to, subject, html});
}