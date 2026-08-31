import { LoginDto, RegisterDto, ResetPasswordDto, ChangePasswordDto } from "../schema/auth.schema";
import { User } from "../models/user.model";
import { comparePassword, hashPassword, hashToken } from "../utils/hash";
import { env } from "../config/env";
import { EmailVerification } from "../models/emailverification.model";
import { createAccessToken, createRefreshToken, verifyJwtToken } from "../utils/jwt.tokens";
import { PasswordReset } from "../models/passwordreset.model";
import { AppError } from "../utils/AppError";
import { Session } from "../models/session.model";
import { AuditLog, AuditMetadata } from "../models/auditLogSchema.model";
import { AUDIT_ACTION, AUDIT_RESOURCE } from "../utils/enum.values";
import { sendResetPasswordEmail, sendVerificationEmail } from "./email.service";
import { isUserLockedOut, loginFailed, loginSuccess } from "../utils/loginFailed.attempts";

export const register =
    async (data: RegisterDto, imageUrl: string, imagePublicId: string, metadata: AuditMetadata) => {

        const { fullName, phone, email, password } = data;

        const existingUser = await User.findOne({
            $or: [
                { email },
                { phone }
            ]
        });

        if (existingUser) {

            if (existingUser.email === email) {
                throw new AppError(
                    "An account with this email already exists!",
                    409,
                    "EMAIL_ALREADY_EXISTS"
                );
            }

            if (existingUser.phone === phone) {
                throw new AppError(
                    "An account with this phone number already exists!",
                    409,
                    "PHONE_ALREADY_EXISTS"
                );
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

        await AuditLog.create({
            action: AUDIT_ACTION.REGISTER,
            user: user._id,
            resource: AUDIT_RESOURCE.USER,
            resourceId: user._id,
            ip: metadata.ipAddress,
            userAgent: metadata.userAgent
        });

        await sendVerificationEmail(user);

        return {
            user: mapUserToUserResponse(user)
        };

    }

export const verifyEmail =
    async (token: string, metadata: AuditMetadata) => {

        const hashedToken = hashToken(token);

        const emailVerificationToken = await EmailVerification.findOne({
            token: hashedToken
        });

        if (!emailVerificationToken) {
            throw new AppError("Invalid or expired verification link", 401, "INVALID_TOKEN");
        }

        const user = await User.findById(emailVerificationToken.user);

        if (!user) {
            throw new AppError("User not found", 404, "USER_NOT_FOUND");
        }

        if (user.isEmailVerified) {
            throw new AppError("Email already verified", 409, "ALREADY_VERIFIED");
        }

        if (emailVerificationToken.expiresAt <= new Date()) {

            await EmailVerification.deleteOne({
                token: hashedToken,
                user: user._id
            });

            await sendVerificationEmail(user);

            throw new AppError(
                "Your verification link has expired. A new verification email has been sent to your registered email address.",
                400,
                "LINK_EXPIRED"
            );
        }

        user.isEmailVerified = true;
        user.isAccountActive = true;

        const updatedUser = await user.save();

        await EmailVerification.deleteOne({
            token: hashedToken,
        })

        await AuditLog.create({
            action: AUDIT_ACTION.EMAIL_VERIFIED,
            user: updatedUser._id,
            resource: AUDIT_RESOURCE.USER,
            resourceId: updatedUser._id,
            ip: metadata.ipAddress,
            userAgent: metadata.userAgent
        });

        return {
            user: mapUserToUserResponse(updatedUser)
        };
    }

export const login =
    async (data: LoginDto, metadata: AuditMetadata) => {

        const { identifier, password } = data;

        const user = await User.findOne({
            $or: [
                { email: identifier },
                { phone: identifier },
            ]
        });

        if (!user) {
            throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");
        }

        if (!user.isEmailVerified) {
            throw new AppError(
                "Please verify your email to activate your account",
                403,
                "EMAIL_NOT_VERIFIED"
            );
        }

        if (!user.isAccountActive) {
            throw new AppError(
                "Your account is inactive, please contact admin to activate your account",
                403,
                "ACCOUNT_INACTIVE"
            );
        }

        // Is user already locked out due to too many failed login attempts
        await isUserLockedOut(user._id.toString());

        const isValidPassword = await comparePassword(password, user.password);

        if (!isValidPassword) {
            //login failed attempts
            await loginFailed(user._id.toString());
            throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");
        }

        //del from redis after login success
        await loginSuccess(user._id.toString());

        const session = new Session({
            user: user._id,
            ip: metadata.ipAddress,
            userAgent: metadata.userAgent
        });

        const accessToken = createAccessToken(
            user._id.toString(),
            user.role,
        );

        const refreshToken = createRefreshToken(
            user._id.toString(),
            session._id.toString(),
        );

        session.refreshTokenHash = hashToken(refreshToken);

        await session.save();

        await AuditLog.create({
            action: AUDIT_ACTION.LOGIN,
            user: user._id,
            resource: AUDIT_RESOURCE.USER,
            resourceId: user._id,
            ip: metadata.ipAddress,
            userAgent: metadata.userAgent
        });

        return {
            accessToken,
            refreshToken,
            user: mapUserToUserResponse(user)
        };

    }

export const refreshToken =
    async (token: string) => {

        const payload = verifyJwtToken(token, env.JWT_REFRESH_SECRET);

        const refreshTokenHash = hashToken(token);

        const session = await Session.findOne({
            _id: payload.sid,
            refreshTokenHash,
            user: payload.sub,
            revoked: false
        });

        if (!session) {
            throw new AppError("Invalid session. Please log in again.", 401, "INVALID_SESSION");
        }

        const user = await User.findById(payload.sub);

        if (!user?.isAccountActive) {

            await Session.updateOne({
                user: payload.sub,
                refreshTokenHash
            }, {
                $set: {
                    revoked: true,
                    revokedAt: new Date(),
                }
            });

            throw new AppError(
                "Your account is no longer available. Please log in again.",
                401,
                "ACCOUNT_INACTIVE"
            );
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
    async (token: string, metadata: AuditMetadata) => {

        const payload = verifyJwtToken(token, env.JWT_REFRESH_SECRET);

        const refreshTokenHash = hashToken(token);

        const session = await Session.findOne({
            _id: payload.sid,
            refreshTokenHash,
            user: payload.sub,
            revoked: false
        });

        if (!session) {
            throw new AppError("Invalid session", 401, "INVALID_SESSION");
        }

        await Session.updateOne({
            refreshTokenHash
        }, {
            $set: {
                revoked: true,
                revokedAt: new Date(),
            }
        });

        await AuditLog.create({
            action: AUDIT_ACTION.LOGOUT,
            user: payload.sub,
            resource: AUDIT_RESOURCE.USER,
            resourceId: payload.sub,
            ip: metadata.ipAddress,
            userAgent: metadata.userAgent
        });

    }

export const logoutAll = async (userId: string, metadata: AuditMetadata) => {

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

    await AuditLog.create({
        action: AUDIT_ACTION.LOGOUT_ALL,
        user: userId,
        resource: AUDIT_RESOURCE.USER,
        resourceId: userId,
        ip: metadata.ipAddress,
        userAgent: metadata.userAgent,
    });

}

export const forgotPassword =
    async (email: string, metadata: AuditMetadata) => {

        const normalizedEmail = email.toLowerCase().trim();

        const user = await User.findOne({
            email: normalizedEmail,
        })

        if (!user) {
            throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");
        }

        if (!user.isEmailVerified) {
            throw new AppError(
                "Please verify your email to activate your account",
                403,
                "EMAIL_NOT_VERIFIED"
            );
        }

        if (!user.isAccountActive) {
            throw new AppError(
                "Your account is inactive, please contact admin to activate your account",
                403,
                "ACCOUNT_INACTIVE"
            );
        }

        const existingToken = await PasswordReset.findOne({
            user: user._id,
        });

        if (existingToken && existingToken.expiresAt > new Date()) {
            throw new AppError(
                "You already have an active reset password link. Please check your email to reset your password.",
                400,
                "RESET_PASSWORD_LINK_ALREADY_EXISTS",
            );
        } else {
            await PasswordReset.deleteMany({
                user: user._id,
            });
        }

        await sendResetPasswordEmail(user);

        await AuditLog.create({
            action: AUDIT_ACTION.FORGOT_PASSWORD,
            user: user._id,
            resource: AUDIT_RESOURCE.USER,
            resourceId: user._id,
            ip: metadata.ipAddress,
            userAgent: metadata.userAgent,
        });

    }

export const resetPassword =
    async (token: string, data: ResetPasswordDto, metadata: AuditMetadata) => {

        const tokenHash = hashToken(token);

        const passwordResetToken = await PasswordReset.findOne({
            token: tokenHash
        });

        if (!passwordResetToken) {
            throw new AppError(
                "Invalid or expired reset password link",
                401,
                "INVALID_OR_EXPIRED_RESET_PASSWORD_LINK"
            );
        }

        const user = await User.findById(passwordResetToken.user);

        if (!user) {
            throw new AppError("User not found", 404, "USER_NOT_FOUND");
        }

        if (!user.isAccountActive) {
            throw new AppError(
                "Your account is inactive, please contact admin to activate your account",
                403,
                "ACCOUNT_INACTIVE"
            );
        }

        if (passwordResetToken.expiresAt <= new Date()) {

            await PasswordReset.deleteOne({
                _id: passwordResetToken._id,
            });

            throw new AppError(
                "Your reset password link has expired",
                401,
                "EXPIRED_RESET_PASSWORD_LINK"
            );
        }

        const isPasswordValid = await comparePassword(data.newPassword, user.password);

        if (isPasswordValid) {
            throw new AppError("New password cannot be same as your old password", 400, "PASSWORD_ALREADY_USED");
        }

        user.password = await hashPassword(data.newPassword);
        await user.save();

        await PasswordReset.deleteOne({
            token: tokenHash,
        });

        await Session.updateMany({
            user: user._id,
            revoked: false,
        }, {
            $set: {
                revoked: true,
                revokedAt: new Date(),
            }
        });

        await AuditLog.create({
            action: AUDIT_ACTION.RESET_PASSWORD,
            user: user._id,
            resource: AUDIT_RESOURCE.USER,
            resourceId: user._id,
            ip: metadata.ipAddress,
            userAgent: metadata.userAgent,
        });

    }

export const changePassword =
    async (userId: string, data: ChangePasswordDto, metadata: AuditMetadata) => {
        const { oldPassword, newPassword } = data;

        const user = await User.findById(userId);

        if (!user) {
            throw new AppError("User not found", 404, "USER_NOT_FOUND");
        }

        const isPasswordSame = await comparePassword(oldPassword, user.password);

        if (!isPasswordSame) {
            throw new AppError("Invalid old password", 400, "INVALID_OLD_PASSWORD");
        }

        if (newPassword === oldPassword) {
            throw new AppError(
                "New password cannot be same as old password",
                400,
                "PASSWORD_ALREADY_USED"
            );
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

        await AuditLog.create({
            action: AUDIT_ACTION.PASSWORD_CHANGED,
            user: userId,
            resource: AUDIT_RESOURCE.USER,
            resourceId: userId,
            ip: metadata.ipAddress,
            userAgent: metadata.userAgent,
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
        createdAt: user.createdAt
    }
}
