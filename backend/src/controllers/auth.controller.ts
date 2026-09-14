import { Request, Response, NextFunction } from 'express';
import {
    login,
    register,
    verifyEmail,
    refreshToken,
    forgotPassword,
    resetPassword,
    logout,
    logoutAll,
    changePassword,
    profileUpdate
} from "../services/auth.service.js";
import { AppError } from "../utils/AppError.js";
import { logError } from '../config/logger.js';
import { redisOperation } from '../utils/redis.operation.js';
import { env } from '../config/env.js';

export const registerUserHandler =
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const metadata = getRequestMetadata(req);

            const { user } = await register(req.body, metadata);

            return res.status(201).json({
                status: "success",
                message: "Account created successfully. Please verify your email to continue.",
                user
            });

        } catch (error) {
            logError("Failed to register an account", error);
            return next(error);
        }
    }

export const verifyUserEmailHandler =
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.query.token as string;

            if (!token) {
                return next(new AppError('Verification token is missing', 404, "TOKEN_NOT_FOUND"));
            }

            const metadata = getRequestMetadata(req);
            const { user } = await verifyEmail(token, metadata);

            return res.status(200).json({
                status: "success",
                message: "User verified successfully",
                user
            });

        } catch (error) {
            logError("Failed to verify account", error);
            return next(error);
        }

    }

export const loginUserHandler =
    async (req: Request, res: Response, next: NextFunction) => {
        try {

            const metadata = getRequestMetadata(req);
            const { accessToken, refreshToken, user } = await login(req.body, metadata);

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: env.NODE_ENV === "production" ? "none" : "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            return res.status(200).json({
                status: "success",
                message: "User logged in successfully",
                user,
                token: accessToken
            });

        } catch (error) {
            logError("Failed to login user", error);
            return next(error);
        }
    }

export const refreshTokenHandler =
    async (req: Request, res: Response, next: NextFunction) => {

        try {
            const token = req.cookies.refreshToken;

            if (!token) {
                return next(new AppError('Refresh token is missing', 404, "REFRESH_TOKEN_MISSING"));
            }

            const { newAccessToken, newRefreshToken, user } = await refreshToken(token);

            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: env.NODE_ENV === "production" ? "none" : "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            })

            return res.status(201).json({
                message: 'New token generated successfully',
                status: "success",
                user,
                token: newAccessToken,
            });

        } catch (error) {
            logError("Failed to generate new token", error);
            return next(error);
        }
    }

export const logoutUserHandler =
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const refreshToken = req.cookies.refreshToken;

            if (!refreshToken) {
                return next(new AppError('Refresh token is missing', 404, "REFRESH_TOKEN_MISSING"));
            }

            const metadata = getRequestMetadata(req);

            await logout(refreshToken, metadata);

            res.clearCookie("refreshToken");

            // blacklisted access token
            if (req.tokenInfo) {
                const { jti, expires } = req.tokenInfo;
                const ttl = Math.ceil(expires - Date.now() / 1000);

                await redisOperation.setEx(
                    `jwt:blacklisted:${jti}`,
                    ttl,
                    "access token"
                );
            }

            return res.status(200).json({
                status: "success",
                message: 'User logged out successfully'
            });

        } catch (error) {
            logError("Failed to logout user", error);
            return next(error);
        }
    }

export const logoutAllHandler =
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?._id.toString();

            if (!userId) {
                return next(new AppError('Unauthorized', 401, "UNAUTHORIZED"));
            }

            const metadata = getRequestMetadata(req);

            await logoutAll(userId, metadata);

            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: true,
                sameSite: env.NODE_ENV === "production" ? "none" : "strict",
            });

            return res.status(200).json({
                status: "success",
                message: "Logged out from all devices successfully",
            });

        } catch (error) {
            logError("Failed to logout from all devices", error);
            return next(error);
        }
    }

export const forgotPasswordHandler =
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.body;

            if (!email) {
                return next(new AppError('Email is required', 400, "EMAIL_REQUIRED"));
            }

            const metadata = getRequestMetadata(req);
            await forgotPassword(email, metadata);

            return res.status(200).json({
                status: "success",
                message: "If an account exists with this email, you will receive a password reset link."
            })
        } catch (error) {
            logError("Failed to send password reset link", error);
            return next(error);
        }

    }

export const resetPasswordHandler =
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.query.token as string;

            if (!token) {
                return next(new AppError('Password reset token is missing', 404, "TOKEN_NOT_FOUND"));
            }

            const metadata = getRequestMetadata(req);

            await resetPassword(token, req.body, metadata);
            res.clearCookie("refreshToken");

            return res.status(200).json({
                status: "success",
                message: "Password reset successfully. Please log in again.",
            });

        } catch (error) {
            logError("Failed to reset password", error);
            return next(error);
        }
    }

export const changePasswordHandler =
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?._id.toString();

            if (!userId) {
                return next(new AppError('Unauthorized', 401, "UNAUTHORIZED"));
            }

            const metadata = getRequestMetadata(req);
            await changePassword(userId, req.body, metadata);

            res.clearCookie("refreshToken");

            return res.status(200).json({
                status: "success",
                message: "Password changed successfully. Please log in again.",
            });

        } catch (error) {
            logError("Failed to change password", error);
            return next(error);
        }
    }

export const updateProfileHandler =
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userInfo = req.user;

            if (!userInfo) {
                return next(new AppError('Unauthorized', 401, "UNAUTHORIZED"));
            }

            const metadata = getRequestMetadata(req);

            if (!req.file) {
                return next(new AppError('Profile picture is required', 400, "PROFILE_PICTURE_REQUIRED"));
            }

            const { user } = await profileUpdate(req.body, req.file, userInfo, metadata);

            return res.status(201).json({
                message: 'User profile updated successfully',
                status: "success",
                user,
            });

        } catch (error) {
            logError("Failed to update user profile", error);
            return next(error);
        }
    }

export const getRequestMetadata = (req: Request) => {
    return {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown"
    }
}