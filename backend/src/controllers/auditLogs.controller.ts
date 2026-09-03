import { Request, Response, NextFunction } from 'express';
import { AppError } from "../utils/AppError";
import { logError } from '../config/logger';
import { getAllUserAuditLogs } from '../services/auditLogs.service';

export const getAllAuditLogs =
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user;

            if (!user) {
                return next(new AppError('Unauthorized', 401, "UNAUTHORIZED"));
            }

            const userId = user._id.toString();

            const auditLogs = await getAllUserAuditLogs(userId);

            return res.status(200).json({
                status: "success",
                message: "User audit logs retrieved successfully",
                auditLogs,
                user
            });

        } catch (error) {
            logError("Failed to retrieve audit logs", error);
            return next(error);
        }
    }