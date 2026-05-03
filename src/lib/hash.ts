import bcrypt from 'bcrypt';

export async function hashPassword(password: string) {
    return await bcrypt.hash(password, 12);
}

export async function hashRefreshToken(refreshToken: string) {
    return await bcrypt.hash(refreshToken, 12);
}