import { generateToken } from "../utils/jwt.tokens";
import { hashToken } from "../utils/hash";
import { EmailVerification } from "../models/emailverification.model";
import { env } from "../config/env";
import { sendEmail } from "../config/mail.config";
import { resetPasswordTemplate, verifyEmailTemplate } from "../utils/templates";
import { IUser } from "../types/user.types";
import { PasswordReset } from "../models/passwordreset.model";

export const sendVerificationEmail = async (user: IUser) => {
    const rawToken = generateToken();
    const token = hashToken(rawToken);

    await EmailVerification.create({
        user: user._id,
        token: token,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    const verifyUrl = `${env.FRONTEND_URL}/verify-email?token=${rawToken}`;

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

    const resetPasswordLink = `${env.FRONTEND_URL}/reset-password?token=${rawToken}`;

    const html = resetPasswordTemplate(resetPasswordLink);

    await sendEmail(
        user.email,
        "Reset Password",
        html
    );
}