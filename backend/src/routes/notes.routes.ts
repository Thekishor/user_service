import { Router } from "express";
import { validateRequest } from "../middleware/validate.middleware";
import { noteSchema } from "../schema/auth.schema";
import { createNoteHandler } from "../controllers/notes.controller";

const notesRoute = Router();

notesRoute.post("/notes", validateRequest(noteSchema), createNoteHandler);