import { generateToken } from "../utils/jwt.tokens.js";
import { hashToken } from "../utils/hash.js";
import { EmailVerification } from "../models/emailverification.model.js";
import { env } from "../config/env.js";
import { IUser } from "../types/express.js";
import { PasswordReset } from "../models/passwordreset.model.js";
import { emailQueue } from "../queues/email.queue.js";
import { logError } from "../config/logger.js";
import { AppError } from "../utils/AppError.js";

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

    // job name define inside the email queue
    // exponential means the delay increases after each failure. like 5s, 10s, 15s
    try {
        await emailQueue.add("send-verification-email", {
            email: user.email,
            verifyUrl
        },
            {
                removeOnComplete: {
                    age: 60,
                },
                removeOnFail: {
                    age: 300,
                },
                attempts: 3,
                backoff: {
                    type: "exponential",
                    delay: 5000,
                },
            }
        );

    } catch (error) {
        logError("Failed to queue verification email:", error);

        throw new AppError(
            "Unable to process verification email. Please try again.",
            503,
            "EMAIL_QUEUE_ERROR"
        );
    }
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

    // job name define inside the email queue
    try {
        await emailQueue.add("send-reset-password-email", {
            email: user.email,
            resetPasswordLink
        }, {
            removeOnComplete: {
                age: 60,
            },
            removeOnFail: {
                age: 300,
            },
            attempts: 3,
            backoff: {
                type: "exponential",
                delay: 5000,
            },
        });
    } catch (error) {
        logError("Failed to queue reset password email:", error);

        throw new AppError(
            "Unable to process reset password email. Please try again.",
            503,
            "EMAIL_QUEUE_ERROR"
        );
    };
}