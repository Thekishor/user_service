import { AuditLog } from "../models/auditLogSchema.model";

export const getAllUserAuditLogs = async(userId: string) => {

    const auditLogs = await AuditLog.find(
        { user: userId }, {
            _id: 1,
            action: 1,
            resource: 1,
            createdAt: 1,
        }
    )
    .sort({ createdAt: -1 });

    if (!auditLogs) {
        return {auditLogs: []};
    }   

    return auditLogs.map((auditLog) => ({
        id: auditLog._id,
        action: auditLog.action,
        resource: auditLog.resource,
        createdAt: auditLog.createdAt,
    }))
}