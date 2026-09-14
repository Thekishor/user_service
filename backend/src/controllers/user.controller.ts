import { Request, Response, NextFunction } from "express";
import { getUsersService, deleteUser } from "../services/user.service.js";
import { AppError } from "../utils/AppError.js";
import { logError } from "../config/logger.js";
import { getRequestMetadata } from "./auth.controller.js";

export const getAllUser =
    async (req: Request, res: Response, next: NextFunction) => {
        try {

            if (!req.user) {
                return next(new AppError("Unauthorized", 401, "UNAUTHORIZED"));
            }

            const adminId = req.user._id.toString();
            const metadata = getRequestMetadata(req);
            const result = await getUsersService(adminId, metadata);

            const { users, totalUsers, activeUsers, inactiveUsers, unverifiedUsers } = result;

            return res.status(200).json({
                status: "success",
                message: "Users retrieved successfully",
                users,
                totalUsers,
                activeUsers,
                inactiveUsers,
                unverifiedUsers
            });

        } catch (error) {
            logError("Failed to get all users", error);
            return next(error);
        }
    }

export const deleteUserHandler =
    async (req: Request, res: Response, next: NextFunction) => {

        try {

            if (!req.user) {
                return next(new AppError("Unauthorized", 401, "UNAUTHORIZED"));
            }

            const adminId = req.user._id.toString();
            const metadata = getRequestMetadata(req);
            const userId = req.params.id;
            await deleteUser(userId, adminId, metadata);

            return res.status(200).json({
                status: "success",
                message: "User deleted successfully",
            })
        } catch (error) {
            logError("Failed to delete user", error);
            return next(error);
        }
    }
