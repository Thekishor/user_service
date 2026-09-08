import { generateToken } from "../utils/jwt.tokens.js";
import { hashToken } from "../utils/hash.js";
import { EmailVerification } from "../models/emailverification.model.js";
import { env } from "../config/env.js";
import { sendEmail } from "../config/mail.config.js";
import { resetPasswordTemplate, verifyEmailTemplate } from "../utils/templates.js";
import { IUser } from "../types/express.js";
import { PasswordReset } from "../models/passwordreset.model.js";

export const sendVerificationEmail = async (user: IUser) => {
    const rawToken = generateToken();
    const token = hashToken(rawToken);

    await EmailVerification.create({
        user: user._id,
        token: token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    const verifyUrl = env.NODE_ENV === "development"
        ? `${env.FRONTEND_URL}/verify-email?token=${rawToken}`
        : `${env.FRONTEND_URL_PROD}/verify-email?token=${rawToken}`;

    const html = verifyEmailTemplate(verifyUrl);

    await sendEmail(
        user.email,
        "Verify Your Email Address",
        html,
    );
}

export const sendResetPasswordEmail = async (user: IUser) => {

    const rawToken = generateToken();
    const tokenHash = hashToken(rawToken);

    await PasswordReset.create({
        user: user._id,
        token: tokenHash,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    const resetPasswordLink = env.NODE_ENV === "development"
        ? `${env.FRONTEND_URL}/reset-password?token=${rawToken}`
        : `${env.FRONTEND_URL_PROD}/reset-password?token=${rawToken}`;

    const html = resetPasswordTemplate(resetPasswordLink);

    await sendEmail(
        user.email,
        "Reset Password",
        html
    );
}