import { LoginDto, RegisterDto, ResetPasswordDto, ChangePasswordDto } from "../schema/auth.schema";
import { User } from "../models/user.model";
import { comparePassword, hashPassword, hashToken } from "../utils/hash";
import { env } from "../config/env";
import { EmailVerificationModel } from "../models/emailverification.model";
import { sendEmail } from "./email.service";
import bcrypt from "bcrypt";
import { createAccessToken, createRefreshToken, generateToken, verifyRefreshToken } from "../utils/jwt.tokens";
import { PasswordResetModel } from "../models/passwordreset.model";
import { AppError } from "../utils/AppError";
import { SessionModel } from "../models/session.model";
import { resetPasswordTemplate, verifyEmailTemplate } from "../utils/templates";

export const register =
    async (data: RegisterDto, imageUrl: string, imagePublicId: string) => {

        const { fullName, phone, email, password } = data;

        const existingUser = await User.findOne({
            $or: [
                { email },
                { phone }
            ]
        });

        if (existingUser) {

            if (existingUser.email === email) {
                throw new AppError("An account with this email already exists!", 409);
            }

            if (existingUser.phone === phone) {
                throw new AppError("An account with this phone number already exists!", 409);
            }
        }

        const passwordHash = await hashPassword(password);

        const user = await User.create({
            fullName,
            phone,  
            email,
            password: passwordHash,
            imageUrl,
            imagePublicId
        });

        const rawToken = generateToken();
        const token = hashToken(rawToken);

        await EmailVerificationModel.create({
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
        
        return {
            user: mapUserToUserResponse(user)
        };

    }

export const verifyEmail =
    async (token: string) => {

        const hashedToken = hashToken(token);

        const emailVerificationToken = await EmailVerificationModel.findOne({
            token: hashedToken
        });

        if (!emailVerificationToken) {
            throw new AppError("Invalid or expired verification link", 401);    
        }

        if (emailVerificationToken.expiresAt < new Date()) {

            await EmailVerificationModel.deleteOne({
                token: hashedToken
            });

            throw new AppError("Your verification link has expired. Please request a new verification email.", 401);
        }

        const user = await User.findById(emailVerificationToken.user._id);

        if (!user) {
            throw new AppError("User not found", 404);
        }

        if (user.isEmailVerified) {
            throw new AppError("Email already verified", 409);
        }

        user.isEmailVerified = true;
        user.isAccountActive = true;

        const updatedUser = await user.save();

        await EmailVerificationModel.deleteOne({
            token: hashedToken,
        })

        return {
            user: mapUserToUserResponse(updatedUser)
        };
    }

export const login =
    async (data: LoginDto, ip: string | undefined, userAgent: string | undefined) => {

        const { identifier, password } = data;

        const user = await User.findOne({
            $or: [
                { email: identifier },
                { phone: identifier },
            ]
        });

        if (!user) throw new AppError("User not found", 404);

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) throw new AppError("Invalid credentials", 401);

        if (!user.isEmailVerified) throw new AppError("Please verify your email to activate your account", 403);

        if (!user.isAccountActive) throw new AppError("Your account is not activated", 401);

        const refreshToken = createRefreshToken(
            user.id,
            user.role,
            user.fullName
        );

        const refreshTokenHash = hashToken(refreshToken);

        const session = await SessionModel.create({
            user: user._id,
            refreshTokenHash,
            ip,
            userAgent,
        });

        const accessToken = createAccessToken(
            user.id,
            user.role,
            user.fullName,
            session._id.toString()
        );

        return { 
            accessToken, 
            refreshToken, 
            user: mapUserToUserResponse(user) 
        };

    }

export const refreshToken =
    async (token: string) => {

        const payload = verifyRefreshToken(token);

        const refreshTokenHash = hashToken(token);

        const session = await SessionModel.findOne({
            refreshTokenHash,
            revoked: false
        })

        if (!session) throw new AppError("Refresh token not found!", 404);

        const user = await User.findById(payload.sub);

        if (!user) throw new AppError("User not found", 401);

        const newAccessToken = createAccessToken(
            user.id,
            user.role,
            user.fullName,
            session._id.toString(),
        );

        const newRefreshToken = createRefreshToken(
            user.id,
            user.role,
            user.fullName
        );

        session.refreshTokenHash = hashToken(newRefreshToken);
        await session.save();

        return { 
            newAccessToken, 
            newRefreshToken, 
            user: mapUserToUserResponse(user) 
        };
    }

export const logout =
    async (token: string) => {

        verifyRefreshToken(token);

        const refreshTokenHash = hashToken(token);

        const session = await SessionModel.findOne({
            refreshTokenHash,
            revoked: false
        });

        if (!session) throw new AppError("Refresh token not found!", 404);

        await SessionModel.deleteOne({ refreshTokenHash });

    }

export const forgotPassword =
    async (email: string) => {

        const normalizedEmail = email.toLowerCase().trim();

        const user = await User.findOne({
            email: normalizedEmail,
        })

        if (!user) {
            throw new AppError("User not found", 404);
        }

        if (!user.isAccountActive) {
            throw new AppError("Your account is not activated", 401);   
        }

        const rawToken = generateToken();
        const tokenHash = hashToken(rawToken);

        await PasswordResetModel.create({
            user: user._id,
            token: tokenHash,
            expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        });

        const resetPasswordLink = `${env.APP_URL}/api/v1/auth/save-password?token=${rawToken}`;

        const html = resetPasswordTemplate(resetPasswordLink);

        await sendEmail(
            user.email,
            "Reset Password",
            html
        );
    }

export const resetPassword =
    async (token: string, data: ResetPasswordDto) => {

        const tokenHash = hashToken(token);

        const passwordResetToken = await PasswordResetModel.findOne({
            token: tokenHash
        }); 

        if (!passwordResetToken) {
            throw new AppError("Token not found", 404);
        }

        if (passwordResetToken.expiresAt < new Date()) {
            await PasswordResetModel.deleteOne({
                token: tokenHash
            });
            throw new AppError("Token expired", 401);
        }

        const user = await User.findById(passwordResetToken.user);

        if (!user) {
            throw new AppError("User not found", 404);
        }

        if (!user.isAccountActive) {
            throw new AppError("Your account is not activated", 401);
        }

        const isPasswordSame = await bcrypt.compare(data.newPassword, user.password);

        if (isPasswordSame) {
            throw new AppError("New password cannot be same as old password", 400);
        }   

        user.password = await hashPassword(data.newPassword);
        await user.save();

        await PasswordResetModel.deleteOne({
            token: tokenHash,
        });

    }

export const changePassword = 
    async (userId: string, data: ChangePasswordDto) => {
        const { oldPassword, newPassword } = data;

        const user = await User.findById(userId);

        if (!user) {
            throw new AppError("User not found", 404);
        }

        const isPasswordSame = await comparePassword(oldPassword, user.password);

        if (!isPasswordSame) {
            throw new AppError("Invalid old password", 400);
        }

        if (newPassword === oldPassword) {
            throw new AppError("New password cannot be same as old password", 400);
        }

        user.password = await hashPassword(newPassword);
        await user.save();
    }

export function mapUserToUserResponse(user: any) {
    return {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isAccountActive: user.isAccountActive,
    }   
}