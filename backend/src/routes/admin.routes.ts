import { Router } from "express";
import verifyToken from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";
import { deleteUserHandler, getAllUser } from "../controllers/user.controller.js";
import { validateQuery } from "../middleware/validate.middleware.js";
import { paginationSchema } from "../schema/auth.schema.js";

const adminRouter = Router();

adminRouter.get("/users", verifyToken, roleMiddleware("admin"), validateQuery(paginationSchema), getAllUser);
adminRouter.delete("/users/:id", verifyToken, roleMiddleware("admin"), deleteUserHandler);

export default adminRouter;