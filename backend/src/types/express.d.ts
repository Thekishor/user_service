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

interface User extends UserInfo {}

interface RateLimit {
    limit: number;
    used: number;
    remaining: number;
    resetTime: Date;
}

declare module "express-serve-static-core" {
    interface Request {
        user?: User,
        rateLimit?: RateLimit
    }
}