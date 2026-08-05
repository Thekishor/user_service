import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const roleMiddleware = (role: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        
        const user = req.user;

        if (!user) {
            throw new AppError("User not found", 404);
        }

        if (user.role !== role) {
            throw new AppError("You do not have permission to access this resources", 403);
        }

        return next();
    }
}