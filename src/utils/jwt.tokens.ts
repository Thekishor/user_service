import jwt from "jsonwebtoken";
import {env} from "../config/env"
import * as crypto from "node:crypto";

export function createAccessToken(userId: string, role: string) {
    const payload = {sub: userId, role, jti: crypto.randomUUID().toString()};
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {   
        expiresIn: "15m"
    })
}

export function createRefreshToken(userId: string, sessionId: string) {
    const payload = {sub: userId, sid: sessionId, jti: crypto.randomUUID().toString()};
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
        expiresIn: "7d"
    })
}


export function verifyRefreshToken(token: string) {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as {
        sub: string,
        sid: string
    }
}

export function verifyAccessToken(token: string) {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as {
        sub: string,
        jti: string
    }
}

export function generateToken() {
    return crypto.randomBytes(64).toString("hex");
}