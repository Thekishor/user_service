import bcrypt from 'bcrypt';
import * as crypto from "node:crypto";

export async function hashPassword(password: string) {
    return await bcrypt.hash(password, 14);
}

export function hashToken(token: string) {
    return crypto.createHash("sha256").update(token).digest("hex");
}

export async function comparePassword(password: string, hash: string) {
    return await bcrypt.compare(password, hash);
}