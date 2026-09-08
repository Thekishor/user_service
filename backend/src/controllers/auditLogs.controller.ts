import { Request, Response, NextFunction } from 'express';
import { AppError } from "../utils/AppError.js";
import { logError } from '../config/logger.js';
import { getAllUserAuditLogs } from '../services/auditLogs.service.js';

export const getAllAuditLogs =
    async (req: Request, res: Response, next: NextFunction) => {
        try {

            if (!req.user) {
                return next(new AppError('Unauthorized', 401, "UNAUTHORIZED"));
            }

            const userId = req.user._id.toString();

            const auditLogs = await getAllUserAuditLogs(userId);

            return res.status(200).json({
                status: "success",
                message: "User audit logs retrieved successfully",
                auditLogs
            });

        } catch (error) {
            logError("Failed to retrieve audit logs", error);
            return next(error);
        }
    }