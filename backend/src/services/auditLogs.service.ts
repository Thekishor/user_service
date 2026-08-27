import { AuditLog } from "../models/auditLogSchema.model"

export const getAllUserAuditLogs = async(userId: string) => {

    const auditLogs = await AuditLog.find(
        { userId: userId }, {
            action: 1,
            resource: 1,
            createdAt: 1,
        }
    ).sort({ createdAt: -1 });

    return auditLogs;
}