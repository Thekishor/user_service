import { Router } from "express";
import verifyToken from "../middleware/auth.middleware.js";
import { validateQuery, validateRequest } from "../middleware/validate.middleware.js";
import { noteSchema, paginationSchema } from "../schema/auth.schema.js";
import {
    createNoteHandler,
    getAllNotesHandler,
    getNoteByIdHandler,
} from "../controllers/notes.controller.js";

const notesRoute = Router();

notesRoute.post("/notes", verifyToken, validateRequest(noteSchema), createNoteHandler);
notesRoute.get("/notes", verifyToken, validateQuery(paginationSchema), getAllNotesHandler);
notesRoute.get("/notes/:id", verifyToken, getNoteByIdHandler);

export default notesRoute;
