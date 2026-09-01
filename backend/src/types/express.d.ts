import "express-serve-static-core";
interface UserInfo {
    id: string;
    email: string;
    phone: string;
    role: string;
    fullName: string;
    isEmailVerified: boolean;
    isAccountActive: boolean;
}

interface RateLimit {
    limit: number;
    used: number;
    remaining: number;
    resetTime: Date;
}

interface TokenInfo {
    token: string,
    jti: string,
    expires: number
}

declare module "express-serve-static-core" {
    interface Request {
        user?: UserInfo,
        rateLimit?: RateLimit,
        tokenInfo?: TokenInfo
    }
}