import { Request, Response, NextFunction } from "express";
import { getUsersService, deleteUser } from "../services/user.service";
import { AppError } from "../utils/AppError";
import { logError } from "../config/logger";

export const getAllUser =
    async (_req: Request, res: Response, next: NextFunction) => {
        try {

            const users = await getUsersService();

            return res.status(200).json({
                status: "success",
                message: "Users retrieved successfully",
                count: users.length,
                users
            });

        } catch (err) {
            logError("Failed to get all users", err);
            return next(err);  
    }
}

export const getMe =
    async (req: Request, res: Response, next: NextFunction) => { 
        try {
            const user = req.user;

            if (!user) {
                throw new AppError("User not found", 404, "USER_NOT_FOUND");
            }

            return res.status(200).json({
                status: "success",
                message: "User retrieved successfully",
                user
            });

        } catch (err) {
            logError("Failed to get current user", err);
            return next(err);
        }   
} 

export const deleteUserHandler =
    async (req: Request, res: Response, next: NextFunction) => {

        try {
            const userId = req.params.id;
            await deleteUser(userId);

            return res.status(200).json({
                status: "success",
                message: "User deleted successfully",
            })
        } catch (err) {
            logError("Failed to delete user", err);
            return next(err);
        }
    }