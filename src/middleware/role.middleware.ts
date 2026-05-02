import {Request, Response, NextFunction} from "express";
import {AppError} from "../lib/AppError";

export const roleMiddleware = (role: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;

        if (!user) {
            return next(new AppError("User not found with this account", 404));
        }

        if (user.role !== role) {
            return next(new AppError("You do not have permission to access this resources", 403));
        }

        next();
    }
}