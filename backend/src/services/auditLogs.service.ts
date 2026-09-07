import { AuditLog } from "../models/auditLogSchema.model";
import { redisOperation } from "../utils/redis.operation";

export const getAllUserAuditLogs = async (userId: string) => {

    const userKey = `user:logs:${userId}`;
    const cached = await redisOperation.get(userKey);

    if (cached) {
        return JSON.parse(cached);
    }

    const userLogs = await AuditLog.find(
        { user: userId }, {
        _id: 1,
        action: 1,
        resource: 1,
        createdAt: 1,
    }
    )
        .sort({ createdAt: -1 })
        .limit(10);

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