import { Request, Response, NextFunction } from 'express';
import { AppError } from "../utils/AppError";
import { logError } from '../config/logger';
import { getAllUserAuditLogs } from '../services/auditLogs.service';

export const getAllAuditLogs =
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return next(new AppError('Unauthorized', 401, "UNAUTHORIZED"));
            }

            const auditLogs = await getAllUserAuditLogs(userId);

            return res.status(200).json({
                status: "success",
                message: "User audit logs retrieved successfully",
                data: auditLogs
            });
            
        } catch (error) {
            logError("Failed to retrieve audit logs", error);
            return next(error);
        }
    }