import bcrypt from 'bcrypt';
import * as crypto from "node:crypto";

export async function hashPassword(password: string) {
    return await bcrypt.hash(password, 14);
}

export function hashRefreshToken(refreshToken: string) {
    return crypto.createHash("sha256").update(refreshToken).digest("hex");
}