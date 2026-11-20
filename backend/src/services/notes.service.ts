import { AuditLog, AuditMetadata } from "../models/auditLogSchema.model";
import { Note } from "../models/note.model";
import { NoteDto } from "../schema/auth.schema";
import mongoose from "mongoose";
import { AUDIT_ACTION, AUDIT_RESOURCE } from "../utils/enum.values";
import { INotes } from "../types/express";
import { AppError } from "../utils/AppError.js";

export const createNoteService =
    async (data: NoteDto, metadata: AuditMetadata, userId: string) => {
        const { title, content, color, tags } = data;

        const session = await mongoose.startSession();
        let createdNotes: INotes | undefined;

        try {

            await session.withTransaction(async () => {

                [createdNotes] = await Note.create([{
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

        if (!createdNotes) {
            throw new AppError("Failed to create note", 500, "NOTE_CREATION_FAILED");
        }

        return {
            notes: mapNotesToNoteResponse(createdNotes)
        }

    }

export function mapNotesToNoteResponse(notes: INotes) {
    return {
        id: notes._id,
        title: notes.title,
        userId: notes.userId,
        content: notes.content,
        color: notes.color,
        tags: notes.tags,
        isPinned: notes.isPinned,
        isArchived: notes.isArchived,
        createdAt: notes.createdAt,
        updatedAt: notes.updatedAt
    }
}