import { Router } from "express";
import { getMe } from "../controllers/user.controller";
import {
    registerUserHandler,
    verifyUserEmailHandler,
    loginUserHandler,
    refreshTokenHandler,
    logoutUserHandler,
    forgotPasswordHandler,
    resetPasswordHandler,
    changePasswordHandler,
    logoutAllHandler
} from "../controllers/auth.controller";
import verifyToken from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/validate.middleware";
import { changePasswordSchema, loginSchema, registerSchema, resetPasswordSchema } from "../schema/auth.schema";
import { getAllAuditLogs } from "../controllers/auditLogs.controller";
//import { upload } from "../middleware/multer.middleware";

const authRouter = Router();

//authRouter.post("/register", upload.single("image"), registerUserHandler);
authRouter.post("/register", validateRequest(registerSchema), registerUserHandler);
authRouter.post("/login", validateRequest(loginSchema), loginUserHandler);
authRouter.get("/verify-email", verifyUserEmailHandler);
authRouter.post("/refresh-token", refreshTokenHandler);
authRouter.post("/logout", verifyToken, logoutUserHandler);
authRouter.post("/logout-all", verifyToken, logoutAllHandler);
authRouter.post("/forgot-password", forgotPasswordHandler);
authRouter.post("/reset-password", validateRequest(resetPasswordSchema), resetPasswordHandler);
authRouter.post("/change-password", verifyToken, validateRequest(changePasswordSchema), changePasswordHandler);
authRouter.get("/me", verifyToken, getMe);
authRouter.get("/audit-logs", verifyToken, getAllAuditLogs);

export default authRouter;