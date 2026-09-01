import { Request, Response, NextFunction } from "express";
import { verifyJwtToken } from "../utils/jwt.tokens";
import { User } from "../models/user.model";
import { AppError } from "../utils/AppError";
import { logError } from "../config/logger";
import { env } from "../config/env";
import { redisOperation } from "../utils/redis.operation";

const verifyToken = async (req: Request, _: Response, next: NextFunction) => {

    if (!req.headers.authorization) {
        logError("Token is missing", null);
        return next(new AppError("Token is missing", 401, "TOKEN_MISSING"));
    }

    const authHeader = req.headers.authorization;

    if (!authHeader.startsWith("Bearer ")) {
        throw new AppError("Invalid Token", 401, "INVALID_TOKEN");
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = verifyJwtToken(token, env.JWT_ACCESS_SECRET);

        if (!payload.sub || !payload.jti) {
            throw new AppError("Invalid Token", 401, "INVALID_TOKEN");
        }

        // check token is blacklisted or not
        const key = `jwt:blacklisted:${payload.jti}`;

        const isBlacklisted = await redisOperation.get(key);

        if (isBlacklisted) {
            throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
        }

        const user = await User.findById(payload.sub);

        if (!user || user.tokenVersion !== payload.tokenVersion) {
            throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
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

        req.tokenInfo = {
            token: token,
            jti: payload.jti,
            expires: payload.exp ?? 0
        }

        return next();

    } catch (error) {
        logError("Failed to verify token", error);
        return next(error);
    }
}

export default verifyToken;