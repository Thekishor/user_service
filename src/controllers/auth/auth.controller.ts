import {Request, Response, NextFunction} from 'express';
import {loginSchema, registerSchema, resetPasswordSchema} from "./auth.schema";
import {
    login,
    register,
    verifyEmail,
    refreshToken,
    forgotPassword,
    resetPassword,
    deleteUser
} from "../../services/auth.service";
import {z} from "zod";

export async function registerUserHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const result = registerSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                message: 'Validation failed!',
                errors: z.flattenError(result.error).fieldErrors
            });
        }
        const user = await register(result.data);

        return res.status(200).json({
            status: "success",
            message: "User created successfully, Please verify your email",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isEmailVerified: user.isEmailVerified,
                isAccountActive: user.isAccountActive,
            }
        });

    } catch (err) {
        console.log(err);
        next(err);
    }
}

export async function verifyUserEmailHandler(req: Request, res: Response, next: NextFunction) {

    try {
        const token = req.query.token as string;

        if (!token) {
            return res.status(400).json({
                message: 'Verification token is missing',
            })
        }

        const updatedUser = await verifyEmail(token);

        return res.status(200).json({
            message: "Verification successfully",
            status: "success",
            user: {
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                isEmailVerified: updatedUser.isEmailVerified,
                isAccountActive: updatedUser.isAccountActive,
            }
        })
    } catch (err) {
        console.log(err);
        next(err);
    }

}

export async function loginUserHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const result = loginSchema.safeParse(req.body);

        if (!result.success) {
            return res.status(400).json({
                message: 'Validation failed!',
                errors: z.flattenError(result.error).fieldErrors
            })
        }

        const {accessToken, refreshToken, user} = await login(result.data);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            status: "success",
            message: "Login successfully",
            accessToken: accessToken,
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                isEmailVerified: user.isEmailVerified,
                isAccountActive: user.isAccountActive
            }
        })
    } catch (err) {
        console.log(err);
        next(err);
    }
}

export async function refreshTokenHandler(req: Request, res: Response, next: NextFunction) {

    try {
        const token = req.cookies.refreshToken as string;

        if (!token) {
            return res.status(401).json({
                message: 'Refresh token is missing',
            })
        }

        const {newAccessToken, newRefreshToken, user} = await refreshToken(token);

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(201).json({
            message: 'Token generated successfully',
            status: "success",
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                isEmailVerified: user.isEmailVerified,
                isAccountActive: user.isAccountActive
            },
            accessToken: newAccessToken,
        })
    } catch (err) {
        console.log(err);
        next(err);
    }

}

export async function logoutUserHandler(req: Request, res: Response, next: NextFunction) {

    try {
        const refreshToken = req.cookies.refreshToken as string;

        if (!refreshToken) {
            return res.status(401).json({
                status: "failure",
                message: 'Refresh token is missing',
            })
        }

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

export async function forgotPasswordHandler(req: Request, res: Response, next: NextFunction) {

    try {
        const {email} = req.body as { email?: string };

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

export async function resetPasswordHandler(req: Request, res: Response, next: NextFunction) {

    try {
        const token = req.query.token as string;

        const {newPassword, confirmPassword} = req.body as {
            newPassword?: string;
            confirmPassword?: string
        };

        if (!token) {
            return res.status(400).json({
                status: "failure",
                message: "Token is required",
            })
        }

        const result = resetPasswordSchema
            .safeParse({newPassword, confirmPassword});

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

export async function deleteUserHandler(req: Request, res: Response, next: NextFunction) {

    try {
        const userId = req.params.id;
        await deleteUser(userId);

        return res.status(200).json({
            status: "success",
            message: "User deleted successfully",
        })
    } catch (e) {
        console.log(e)
        next(e);
    }
}