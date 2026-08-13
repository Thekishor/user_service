import { Request, Response, NextFunction } from 'express';
import { loginSchema, registerSchema, resetPasswordSchema } from "../schema/auth.schema";
import {
    login,
    register,
    verifyEmail,
    refreshToken,
    forgotPassword,
    resetPassword,
    logout
} from "../services/auth.service";
import { z } from "zod";
import { AppError } from "../utils/AppError";
import { uploadOnCloudinary } from '../utils/cloudinary';

export const registerUserHandler =  
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            let imageUrl = '';
            let imagePublicId = '';

            if (req.file?.path) {
                const uploadedFile = await uploadOnCloudinary(req.file.path);

                if (uploadedFile) {
                    imageUrl = uploadedFile.secure_url;
                    imagePublicId = uploadedFile.public_id;
                }
            }

            const result = registerSchema.safeParse(req.body);

            if (!result.success) {
                return res.status(400).json({
                    message: 'Validation failed!',
                    errors: z.flattenError(result.error).fieldErrors
                });
            }

            const { user } = await register(result.data, imageUrl, imagePublicId);

            return res.status(201).json({
                status: "success",
                message: "User created successfully, Please verify your email",
                user
            });

        } catch (err) {
            next(err);
        }
    }

export const verifyUserEmailHandler =
    async (req: Request, res: Response, next: NextFunction) => {

        try {
            const token = req.query.token as string;

            if (!token) {
                return res.status(400).json({
                    message: 'Verification token is missing',
                })
            }

            const { user } = await verifyEmail(token);

            return res.status(200).json({
                message: "User verified successfully",
                user
            })
        } catch (err) {
            return next(err);
        }

    }

export const loginUserHandler =
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = loginSchema.safeParse(req.body);

            if (!result.success) {
                return res.status(400).json({
                    message: 'Validation failed!',
                    errors: z.flattenError(result.error).fieldErrors
                })
            }

            const { accessToken, refreshToken, user } = await login(
                result.data,
                req.ip,
                req.get("User-Agent")
            );

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
            })
        } catch (err) {
            console.log(err);
            next(err);
        }
    }

export const refreshTokenHandler =
    async (req: Request, res: Response, next: NextFunction) => {

        try {
            const token = req.cookies.refreshToken;

            if (!token) {
                return next(new AppError('Refresh token is missing', 404));
            }

            const { newAccessToken, newRefreshToken, user } = await refreshToken(token);

            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            })

            res.status(201).json({
                message: 'New token generated successfully',
                status: "success",  
                user,
                token: newAccessToken,
            })
        } catch (err) {
            console.log(err);
            next(err);
        }

    }

export const logoutUserHandler =
    async (req: Request, res: Response, next: NextFunction) => {

        try {
            const refreshToken = req.cookies.refreshToken;

            if (!refreshToken) {
                return next(new AppError('Refresh token is missing', 404));
            }

            await logout(refreshToken);

            res.clearCookie("refreshToken");

            res.status(200).json({
                status: "success",
                message: 'User logged out successfully'
            })
        } catch (err) {
            console.log(err);
            next(err);
        }
    }

export const forgotPasswordHandler =
    async (req: Request, res: Response, next: NextFunction) => {

        try {
            const { email } = req.body;

            if (!email) {
                return res.status(400).json({
                    message: 'Email is required',
                })
            }

            await forgotPassword(email);

            return res.status(200).json({
                status: "success",
                message: "Password reset link sent to your email"
            })
        } catch (err) {
            console.log(err);
            next(err);
        }

    }

export const resetPasswordHandler =
    async (req: Request, res: Response, next: NextFunction) => {

        try {
            const token = req.query.token as string;

            if (!token) {
                return res.status(400).json({
                    status: "failure",
                    message: "Token is required",
                })
            }

            const result = resetPasswordSchema.safeParse(req.body);

            if (!result.success) {
                return res.status(400).json({
                    message: 'Validation failed!',
                    errors: z.flattenError(result.error).fieldErrors
                });
            }

            await resetPassword(token, result.data);

            return res.status(200).json({
                status: "success",
                message: "Password reset successfully",
            })
        } catch (err) {
            console.log(err);
            next(err);
        }
    }