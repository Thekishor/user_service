import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env"
import * as crypto from "node:crypto";
import { AppError } from "./AppError";

export function createAccessToken(userId: string, role: string, tokenVersion: number) {
    const payload = { sub: userId, role, tokenVersion, jti: crypto.randomUUID().toString() };
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
        expiresIn: "15m"
    })
}

export function createRefreshToken(userId: string, sessionId: string) {
    const payload = { sub: userId, sid: sessionId, jti: crypto.randomUUID().toString() };
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
        expiresIn: "7d"
    })
}

export function verifyJwtToken(token: string, jwtSecret: string): JwtPayload {
    try {
        return jwt.verify(token, jwtSecret) as JwtPayload;
    } catch (error) {

        if (error instanceof jwt.TokenExpiredError) {
            throw new AppError("Token expired", 401, "TOKEN_EXPIRED");
        }

        if (error instanceof jwt.JsonWebTokenError) {
            throw new AppError("Invalid token", 401, "INVALID_TOKEN");
        }

        throw new AppError("Authentication failed", 401, "AUTH_FAILED");
    }
}

export function generateToken() {
    return crypto.randomBytes(64).toString("hex");
}