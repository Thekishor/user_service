import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";
import { logError } from "../config/logger.js";
import { getRequestMetadata } from "./auth.controller.js";
import {
    createNoteService,
    getAllNotesService,
    getNoteByIdService,
} from "../services/notes.service.js";
import { PaginationQuery } from "../schema/auth.schema.js";
import { parseQuery } from "../utils/query.js";

export const createNoteHandler =
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                return next(new AppError("Unauthorized", 401, "UNAUTHORIZED"));
            }

            const userId = req.user._id.toString();
            const metadata = getRequestMetadata(req);

            const { notes } = await createNoteService(req.body, metadata, userId);

            return res.status(200).json({
                status: "success",
                message: "User notes created successfully",
                notes
            });
        } catch (error) {
            logError("Failed to create notes for user", error);
            return next(error);
        }
    };

export const getAllNotesHandler =
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                return next(new AppError("Unauthorized", 401, "UNAUTHORIZED"));
            }

            const userId = req.user._id.toString();
            const metadata = getRequestMetadata(req);
            const query = res.locals.query as PaginationQuery;
            const { skip, limit, search, orderBy } = parseQuery(query);

            const { result } = await getAllNotesService(
                userId,
                metadata,
                skip,
                limit,
                search,
                orderBy,
            );

            return res.status(200).json({
                status: "success",
                message: "Notes retrieved successfully",
                notes: result.notes,
                totalNotes: result.totalNotes,
                totalPages: result.totalPages
            });
        } catch (error) {
            logError("Failed to retrieve notes", error);
            return next(error);
        }
    };

export const getNoteByIdHandler =
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user) {
                return next(new AppError("Unauthorized", 401, "UNAUTHORIZED"));
            }

            const userId = req.user._id.toString();
            const metadata = getRequestMetadata(req);
            const noteId = req.params.id;

            const { noteResponse } = await getNoteByIdService(noteId, metadata, userId);

            return res.status(200).json({
                status: "success",
                message: "Note retrieved successfully",
                note: noteResponse,
            });
        } catch (error) {
            logError("Failed to retrieve note by ID", error);
            return next(error);
        }
    };
