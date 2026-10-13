import { Request, Response, NextFunction } from 'express';
import { AppError } from "../utils/AppError.js";
import { logError } from '../config/logger.js';
import { getAllUserAuditLogs } from '../services/auditLogs.service.js';
import { PaginationQuery } from '../schema/auth.schema.js';
import { parseQuery } from "../utils/query.js";

export const getAllAuditLogs =
    async (req: Request, res: Response, next: NextFunction) => {
        try {

            if (!req.user) {
                return next(new AppError('Unauthorized', 401, "UNAUTHORIZED"));
            }

            const userId = req.user._id.toString();
            const query = res.locals.query as PaginationQuery;
            const { skip, limit, search, orderBy } = parseQuery(query);

            const auditLogs = await getAllUserAuditLogs(userId, skip, limit, search, orderBy);

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
