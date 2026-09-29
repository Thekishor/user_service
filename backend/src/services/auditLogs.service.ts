import { AuditLog } from "../models/auditLogSchema.model.js";
import { redisOperation } from "../utils/redis.operation.js";

export const getAllUserAuditLogs = async (
    userId: string,
    skip: number,
    limit: number,
    search: string,
    orderBy: Record<string, 1 | -1>
) => {

    const userKey = `user:logs:${userId}:${skip}:${limit}:${search}:${JSON.stringify(orderBy)}`;
    const cached = await redisOperation.get(userKey);

    if (cached) {
        return JSON.parse(cached);
    }

    const filter = {
        user: userId,
        ...(search && {
            $or: [
                { action: { $regex: search, $options: "i" } },
                { resource: { $regex: search, $options: "i" } },
            ]
        })
    };

    const userLogs = await AuditLog.find(
        filter,
        {
            _id: 1,
            action: 1,
            resource: 1,
            createdAt: 1,
        }
    )
        .sort(orderBy)
        .skip(skip)
        .limit(limit);

    if (!userLogs) {
        return { auditLogs: [] };
    }

    const auditLogs = userLogs.map((auditLog) => ({
        id: auditLog._id,
        action: auditLog.action,
        resource: auditLog.resource,
        createdAt: auditLog.createdAt,
    }));

    // set to redis
    await redisOperation.setEx(
        userKey,
        600,
        JSON.stringify(auditLogs)
    );

    return auditLogs;
}