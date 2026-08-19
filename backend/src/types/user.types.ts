import { Types } from "mongoose";

export interface IUser {
    _id: Types.ObjectId;
    fullName: string;
    email: string;
    phone: string;
    role: "USER" | "ADMIN";
    isEmailVerified: boolean;
    isAccountActive: boolean;
    tokenVersion: number;
}