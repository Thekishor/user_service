import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";
import { logError } from "../config/logger.js";
import { getRequestMetadata } from "./auth.controller.js";
import { createNoteService } from "../services/notes.service.js";

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
    }