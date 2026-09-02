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
} from "../services/auth.service";
import { AppError } from "../utils/AppError";
import { uploadOnCloudinary } from '../utils/cloudinary';
import { logError } from '../config/logger';
import { redisOperation } from '../utils/redis.operation';

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

        } catch (err) {
            logError("Failed to register an account", err);
            return next(err);
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

        } catch (err) {
            logError("Failed to verify account", err);
            return next(err);
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
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            return res.status(200).json({
                status: "success",
                message: "User logged in successfully",
                user,
                token: accessToken
            });

        } catch (err) {
            logError("Failed to login user", err);
            return next(err);
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
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            })

            return res.status(201).json({
                message: 'New token generated successfully',
                status: "success",
                user,
                token: newAccessToken,
            });

        } catch (err) {
            logError("Failed to generate new token", err);
            return next(err);
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

        } catch (err) {
            logError("Failed to logout user", err);
            return next(err);
        }
    }

export const logoutAllHandler =
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return next(new AppError('Unauthorized', 401, "UNAUTHORIZED"));
            }

            const metadata = getRequestMetadata(req);

            await logoutAll(userId, metadata);

            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: true,
                sameSite: 'strict'
            });

            return res.status(200).json({
                status: "success",
                message: "Logged out from all devices successfully",
            });

        } catch (err) {
            logError("Failed to logout from all devices", err);
            return next(err);
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
                message: "Password reset link sent to your email"
            })
        } catch (err) {
            logError("Failed to send password reset link", err);
            return next(err);
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

        } catch (err) {
            logError("Failed to reset password", err);
            return next(err);
        }
    }

export const changePasswordHandler =
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;

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

        } catch (err) {
            logError("Failed to change password", err);
            return next(err);
        }
    }

export const updateProfileHandler =
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return next(new AppError('Unauthorized', 401, "UNAUTHORIZED"));
            }

            let imageUrl = '';
            let imagePublicId = '';

            if (!req.file) {
                throw new AppError("Profile image is required", 400, "PROFILE_IMAGE_REQUIRED");
            }

            if (!req.file.mimetype.startsWith("image/")) {
                throw new AppError("Only image files are allowed", 400, "INVALID_FILE_TYPE");
            }

            if (req.file?.path) {
                const uploadedFile = await uploadOnCloudinary(req.file.path);

                if (uploadedFile) {
                    imageUrl = uploadedFile.secure_url;
                    imagePublicId = uploadedFile.public_id;
                }
            }

            const metadata = getRequestMetadata(req);

            const { user } = await profileUpdate(req.body, userId, imageUrl, imagePublicId, metadata);

            return res.status(201).json({
                message: 'User profile updated successfully',
                status: "success",
                user,
            });

        } catch (err) {
            logError("Failed to update user profile", err);
            return next(err);
        }
    }

export const getRequestMetadata = (req: Request) => {
    return {
        ipAddress: req.ip || "unknown",
        userAgent: req.get("User-Agent") || "unknown"
    }
}