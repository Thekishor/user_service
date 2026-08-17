import { LoginDto, RegisterDto, ResetPasswordDto, ChangePasswordDto } from "../schema/auth.schema";
import { User } from "../models/user.model";
import { comparePassword, hashPassword, hashToken } from "../utils/hash";
import { env } from "../config/env";
import { EmailVerification } from "../models/emailverification.model";
import { sendEmail } from "./email.service";
import { createAccessToken, createRefreshToken, generateToken, verifyRefreshToken } from "../utils/jwt.tokens";
import { PasswordReset } from "../models/passwordreset.model";
import { AppError } from "../utils/AppError";
import { Session } from "../models/session.model";
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
        
        return {
            user: mapUserToUserResponse(user)
        };

    }

export const verifyEmail =
    async (token: string) => {

        const hashedToken = hashToken(token);

        const emailVerificationToken = await EmailVerification.findOne({
            token: hashedToken
        });

        if (!emailVerificationToken) {
            throw new AppError("Invalid or expired verification link", 401);    
        }

        if (emailVerificationToken.expiresAt < new Date()) {

            await EmailVerification.deleteOne({
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

        await EmailVerification.deleteOne({
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

        if (!user) throw new AppError("Invalid credentials", 401);

        if (!user.isEmailVerified) throw new AppError("Please verify your email to activate your account", 403);

        if (!user.isAccountActive) throw new AppError("Your account is inactive, please contact admin to activate your account", 403);

        const isValidPassword = await comparePassword(password, user.password);

        if (!isValidPassword) throw new AppError("Invalid credentials", 401);

        const session = new Session({
            user: user._id,
            ip,
            userAgent
        });

        const accessToken = createAccessToken(
            user._id.toString(),
            user.role,
        );

        const refreshToken = createRefreshToken(
            user._id.toString(),
            session._id.toString()  
        );

        session.refreshTokenHash = hashToken(refreshToken);

        await session.save();

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

        const session = await Session.findOne({
            _id: payload.sid,
            refreshTokenHash,
            user: payload.sub,
            revoked: false
        });

        if (!session) throw new AppError("Invalid session. Please log in again.", 401);

        const user = await User.findById(payload.sub);

        if (!user || !user.isAccountActive) {

            await Session.updateOne({  
                user: payload.sub,
                refreshTokenHash 
            }, {
                $set: {
                    revoked: true,
                    revokedAt: new Date(),
                }
            });

            throw new AppError("Your account is no longer available. Please log in again.", 401);
        }

        const newAccessToken = createAccessToken(
            user._id.toString(),
            user.role,
        );

        const newRefreshToken = createRefreshToken(
            user._id.toString(),
            session._id.toString()
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

        const payload =  verifyRefreshToken(token);

        const refreshTokenHash = hashToken(token);

        const session = await Session.findOne({
            _id: payload.sid,
            refreshTokenHash,
            user: payload.sub,
            revoked: false
        });

        if (!session) throw new AppError("Invalid session", 401);

        await Session.updateOne({ 
            refreshTokenHash 
        }, {
            $set: {
                revoked: true,
                revokedAt: new Date(),
            }
        });

    }

export const logoutAll = async(userId: string) => {

    await Session.updateMany({
        user: userId,
        revoked: false,
    }, {
        $set: {
            revoked: true,
            revokedAt: new Date(),
        }
    });

    await User.updateOne({
        _id: userId,
    }, {
        $inc: {
            tokenVersion: 1
        },
    });

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
            throw new AppError("Your account is inactive, please contact admin to activate your account", 403);   
        }

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

export const resetPassword =
    async (token: string, data: ResetPasswordDto) => {

        const tokenHash = hashToken(token);

        const passwordResetToken = await PasswordReset.findOne({
            token: tokenHash
        }); 

        if (!passwordResetToken) {
            throw new AppError("Invalid or expired reset password link", 401);
        }

        if (passwordResetToken.expiresAt < new Date()) {

            await PasswordReset.deleteOne({
                token: tokenHash
            });

            throw new AppError("Your reset password link has expired. Please request a new reset password link.", 401);
        }

        const user = await User.findById(passwordResetToken.user);

        if (!user) {
            throw new AppError("User not found", 404);
        }

        if (!user.isAccountActive) {
            throw new AppError("Your account is inactive, please contact admin to activate your account", 403);
        }

        const isPasswordSame = await comparePassword(data.newPassword, user.password);

        if (isPasswordSame) {
            throw new AppError("New password cannot be same as old password", 400);
        }   

        user.password = await hashPassword(data.newPassword);
        await user.save();

        await PasswordReset.deleteOne({
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

        await Session.updateMany({  
            user: userId,
            revoked: false,
        }, {
            $set: {
                revoked: true,
                revokedAt: new Date(),
            }
        });
    }

export function mapUserToUserResponse(user: any) {
    return {
        id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isAccountActive: user.isAccountActive,
    }   
}