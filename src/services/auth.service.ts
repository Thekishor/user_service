import {LoginDto, RegisterDto, ResetPasswordDto} from "../controllers/auth/auth.schema";
import {User} from "../models/user.model";
import {hashPassword} from "../lib/hash";
import jwt from "jsonwebtoken";
import {env} from "../config/env";
import {EmailVerificationModel} from "../models/emailverification.model";
import {sendEmail} from "./email.service";
import bcrypt from "bcrypt";
import * as crypto from "node:crypto";
import {createAccessToken, createRefreshToken, verifyRefreshToken} from "../lib/jwt.tokens";
import {PasswordResetModel} from "../models/passwordreset.model";
import {AppError} from "../lib/AppError";

export const register = async (data: RegisterDto) => {

    const {name, email, password} = data;

    const normalizedEmail = email.toLowerCase().trim();

    const isRegisteredUser = await User.findOne({
        email: normalizedEmail,
    });

    if (isRegisteredUser) {
        throw new AppError("An account with this user already exists!", 404);
    }

    const passwordHash = await hashPassword(password);

    const user = await User.create({
        name: name,
        email: normalizedEmail,
        password: passwordHash,
    });

    const verifyToken = jwt.sign({
        sub: user._id,
    }, env.TOKEN_SECRET, {expiresIn: "1d"});

    await EmailVerificationModel.create({
        user: user._id,
        token: verifyToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    const verifyUrl = `${env.APP_URL}/api/users/auth/verify-email?token=${verifyToken}`;

    const html = `
       <h1>Verify Your Email</h1>
       <p>Thanks for signing up! Please verify your email address.</p>
       <p>Click the link below to verify your email:</p>
       <a href="${verifyUrl}">Verify Email</a>
       <p>This link will expire in 24 hour.</p>
       <p>If you did not request this, please ignore this email.</p>
       `;

    await sendEmail(
        user.email,
        "Verify your email",
        html,
    );
    return user;

}
export const verifyEmail = async (token: string) => {

    let decoded = null;
    try {
        decoded = jwt.verify(token, env.TOKEN_SECRET) as {
            sub: string
        }
    } catch (e) {
        if (e instanceof jwt.TokenExpiredError) {
            throw new AppError("Verification token has expired", 409);
        }
        throw new AppError("Invalid token", 400);
    }

    const emailVerificationToken = await EmailVerificationModel.findOne({
        token
    });

    if (!emailVerificationToken) {
        throw new AppError("Token not found or already used", 409);
    }

    const user = await User.findById(decoded.sub);

    if (!user) {
        throw new AppError("User not found", 404);
    }

    if (user.isEmailVerified) {
        throw new AppError("Email already verified", 409);
    }

    user.isEmailVerified = true;
    const updatedUser = await user.save();

    await EmailVerificationModel.deleteOne({
        token: token,
    })

    return updatedUser;
}
export const login = async (data: LoginDto) => {

    const {email, password} = data;

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
        email: normalizedEmail,
    });

    if (!user) {
        throw new AppError("User not found", 404);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
        throw new AppError("Invalid password", 401);
    }

    if (!user.isEmailVerified) {
        throw new AppError("Please verify your email", 403);
    }

    const accessToken = createAccessToken(
        user.id,
        user.role
    );

    const refreshToken = createRefreshToken(
        user.id,
        user.role
    );

    return {accessToken, refreshToken, user};

}
export const refreshToken = async (token: string) => {

    const payload = verifyRefreshToken(token);

    const user = await User.findById(payload.sub);

    if (!user) {
        throw new AppError("User not found", 401);
    }

    const newAccessToken = createAccessToken(
        user.id,
        user.role
    );

    const newRefreshToken = createRefreshToken(
        user.id,
        user.role
    );

    return {newAccessToken, newRefreshToken, user};
}
export const forgotPassword = async (email: string) => {

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
        email: normalizedEmail,
    })

    if (!user) {
        throw new AppError("User not found", 404);
    }

    const rawToken = crypto.randomBytes(32).toString("hex");

    const hashToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    await PasswordResetModel.create({
        user: user._id,
        token: hashToken,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    const resetPasswordLink = `${env.APP_URL}/api/users/auth/save-password?token=${rawToken}`;

    const html = `
         <h1>Reset Your Password</h1>
         <p>We received a request to reset your password.</p>
         <p>Click the link below to reset your password:</p>
         <a href="${resetPasswordLink}">Reset Password</a>
         <p>This link will expire in 15 minute.</p>
         <p>If you did not request a password reset, please ignore this email.</p>`;

    await sendEmail(
        user.email,
        "Reset Password",
        html
    );
}
export const resetPassword = async (token: string, data: ResetPasswordDto) => {

    const hashToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

    const passwordResetModel = await PasswordResetModel.findOne({
        token: hashToken,
        expiresAt: {$gt: new Date()},
    });

    if (!passwordResetModel) {
        throw new AppError("Token not found", 400);
    }

    const user = await User.findById(
        passwordResetModel.user._id
    );

    if (!user) {
        throw new AppError("User not found", 400);
    }

    user.password = await hashPassword(data.newPassword);
    await user.save();

    await PasswordResetModel.deleteOne({
        token: hashToken,
    });

}