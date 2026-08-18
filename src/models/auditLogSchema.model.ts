import mongoose from "mongoose";
import { AUDIT_ACTION, AUDIT_RESOURCE } from "../utils/enum.values";


const auditLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    action: {
        type: String,
        enum: Object.values(AUDIT_ACTION),
        required: true,
    },
    resource: {
        type: String,
        enum: Object.values(AUDIT_RESOURCE),
        required: true,
    },
    resourceId: mongoose.Schema.Types.ObjectId,
    ip: { type: String },
    userAgent: { type: String }
}, {
    timestamps: true,
});

export interface AuditMetadata {
    ipAddress: string;
    userAgent: string;
}

export const AuditLog = mongoose.model("AuditLog", auditLogSchema);