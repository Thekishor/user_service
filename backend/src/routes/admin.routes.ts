import { Router } from "express";
import verifyToken from "../middleware/auth.middleware.js";
import { roleMiddleware } from "../middleware/role.middleware.js";
import { deleteUserHandler, getAllUser } from "../controllers/user.controller.js";

const adminRouter = Router();

adminRouter.get("/users", verifyToken, roleMiddleware("admin"), getAllUser);
adminRouter.delete("/users/:id", verifyToken, roleMiddleware("admin"), deleteUserHandler);

export default adminRouter;