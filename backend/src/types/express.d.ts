import "express-serve-static-core";
import { Types } from "mongoose";

export interface IUser {
    _id: Types.ObjectId;
    fullName: string;
    email: string;
    phone: string;
    role: string;
    isEmailVerified: boolean;
    isAccountActive: boolean;
    imageUrl?: string | null;
    imagePublicId?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface INotes {
    _id: Types.ObjectId;
    title: string;
    userId: Types.ObjectId | string;
    content: string;
    color: string;
    tags: string[];
    isPinned: boolean;
    isArchived: boolean;
    createdAt: Date;
    updatedAt: Date;
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
        user?: IUser,
        rateLimit?: RateLimit,
        tokenInfo?: TokenInfo
    }
}