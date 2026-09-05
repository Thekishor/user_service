import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { logError } from "../config/logger";

export const roleMiddleware = (role: string) => {
    return (req: Request, _: Response, next: NextFunction) => {

        try {
            const user = req.user;

            if (!user) {
                throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
            }

            if (user.role !== role) {
                throw new AppError(
                    "Access denied. Insufficient role",
                    403,
                    "ROLE_FORBIDDEN"
                );
            }

            return next();

        } catch (error) {
            logError("Failed to verify role", error);
            return next(error);
        }
    }
}