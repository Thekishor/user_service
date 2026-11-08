import { AuditLog, AuditMetadata } from "../models/auditLogSchema.model";
import { Note } from "../models/note.model";
import { NoteDto } from "../schema/auth.schema";
import mongoose from "mongoose";
import { AUDIT_ACTION, AUDIT_RESOURCE } from "../utils/enum.values";

export const createNoteService = 
async(data: NoteDto, metadata: AuditMetadata, userId: string) => {
    const {title, content, color, tags } = data;

    const session = await mongoose.startSession();
    
        try {
    
            await session.withTransaction(async () => {
    
                 const notes = await Note.create([{
                    userId,
                    title,
                    content,
                    color,
                    tags
                 }], { session });
    
                await AuditLog.create([{
                    action: AUDIT_ACTION.NOTE_CREATED,
                    user: userId,
                    resource: AUDIT_RESOURCE.NOTE,
                    resourceId: userId,
                    ip: metadata.ipAddress,
                    userAgent: metadata.userAgent
                }], { session });
            });
    
        } finally {
            await session.endSession();
        }
        
}