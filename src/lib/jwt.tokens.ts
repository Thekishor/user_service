import jwt from "jsonwebtoken";
import {env} from "../config/env"

export function createAccessToken(userId: string, role: string, name: string, sessionId: string) {
    const payload = {sub: userId, role, name, sessionId};
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
        expiresIn: "15m"
    })
}

export function createRefreshToken(userId: string, role: string,) {
    const payload = {sub: userId, role};
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
        expiresIn: "7d"
    })
}


export function verifyRefreshToken(token: string) {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as {
        sub: string;
    }
}

export function verifyAccessToken(token: string) {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as {
        sub: string,
        role: string;
    }
}