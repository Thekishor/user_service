import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.tokens";
import { User } from "../models/user.model";
import { AppError } from "../utils/AppError";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                phone: string;
                role: string;
                fullName: string;
                isEmailVerified: boolean;
                isAccountActive: boolean;
            };
        }
    }
}

const verifyToken = async (req: Request, _: Response, next: NextFunction) => {

    if (!req.headers.authorization) {
        return next(new AppError("Token is missing", 401, "TOKEN_MISSING"));
    }

    const authHeader = req.headers.authorization;

    if (!authHeader.startsWith("Bearer ")) {
        throw new AppError("Invalid Token", 401, "INVALID_TOKEN");
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = verifyAccessToken(token);

        if (!payload.sub) {
            throw new AppError("Invalid Token", 401, "INVALID_TOKEN");
        }   

        const user = await User.findById(payload.sub);

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

        req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
            phone: user.phone,
            fullName: user.fullName,
            isEmailVerified: user.isEmailVerified,
            isAccountActive: user.isAccountActive
        }

        return next();
    } catch (error) {
        return next(new AppError("Invalid or expired token", 401, "INVALID_OR_EXPIRED_TOKEN"));
    }
}

export default verifyToken;