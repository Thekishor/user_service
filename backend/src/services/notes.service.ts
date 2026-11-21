import { AuditLog, AuditMetadata } from "../models/auditLogSchema.model.js";
import { Note } from "../models/note.model.js";
import { NoteDto } from "../schema/auth.schema.js";
import mongoose from "mongoose";
import { AUDIT_ACTION, AUDIT_RESOURCE } from "../utils/enum.values.js";
import { INotes } from "../types/express";
import { AppError } from "../utils/AppError.js";
import { redisOperation } from "../utils/redis.operation.js";

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

        // Invalidate cached notes for this user
        await redisOperation.del(`notes:all:${userId}:*`);

        return {
            notes: mapNotesToNoteResponse(createdNotes)
        };

    };

export const getAllNotesService = async (
    userId: string,
    metadata: AuditMetadata,
    skip: number,
    limit: number,
    search: string,
    orderBy: Record<string, 1 | -1>,
) => {
    const key = `notes:all:${userId}:${skip}:${limit}:${search}:${JSON.stringify(orderBy)}`;
    const cached = await redisOperation.get(key);

    if (cached) {
        return JSON.parse(cached);
    }

    const filter = {
        userId,
        ...(search && {
            $or: [
                { title: { $regex: search, $options: "i" } },
                { content: { $regex: search, $options: "i" } },
                { tags: { $in: [new RegExp(search, "i")] } },
            ],
        }),
    };

    const [allNotes, totalNotes] = await Promise.all([

        // find all
        Note.find(filter)
            .sort(orderBy)
            .skip(skip)
            .limit(limit),

        // count
        Note.countDocuments(filter),
    ]);

    if (totalNotes === 0) {

        await AuditLog.create({
            action: AUDIT_ACTION.GET_NOTES,
            user: userId,
            resource: AUDIT_RESOURCE.NOTE,
            resourceId: userId,
            ip: metadata.ipAddress,
            userAgent: metadata.userAgent,
        });

        return {
            response: {
                notes: [],
                totalNotes: 0,
                totalPages: 0,
            }
        };
    }

    const mappedNotes = allNotes.map((note) =>
        mapNotesToNoteResponse(note)
    );

    await AuditLog.create({
        action: AUDIT_ACTION.GET_NOTES,
        user: userId,
        resource: AUDIT_RESOURCE.NOTE,
        resourceId: userId,
        ip: metadata.ipAddress,
        userAgent: metadata.userAgent,
    });

    const result = {
        notes: mappedNotes,
        totalNotes,
        totalPages: Math.ceil(totalNotes / limit),
    };

    await redisOperation.setEx(key, 300, JSON.stringify(result));

    return result;
};

export const getNoteByIdService = async (
    noteId: string,
    metadata: AuditMetadata,
    userId: string
) => {
    if (!mongoose.Types.ObjectId.isValid(noteId)) {
        throw new AppError("Invalid note ID format", 400, "INVALID_NOTE_ID");
    }

    const key = `notes:single:${userId}:${noteId}`;
    const cached = await redisOperation.get(key);

    if (cached) {
        return JSON.parse(cached);
    }

    const note = await Note.findOne({ _id: noteId, userId });

    if (!note) {
        throw new AppError("Note not found", 404, "NOTE_NOT_FOUND");
    }

    await AuditLog.create({
        action: AUDIT_ACTION.GET_NOTE_BY_ID,
        user: userId,
        resource: AUDIT_RESOURCE.NOTE,
        resourceId: note._id,
        ip: metadata.ipAddress,
        userAgent: metadata.userAgent,
    });

    const result = {
        noteResponse: mapNotesToNoteResponse(note),
    };

    await redisOperation.setEx(key, 300, JSON.stringify(result));

    return result;
};

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
    };
}
