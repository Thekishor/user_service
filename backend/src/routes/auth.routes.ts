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
import { createRateLimiters } from "../config/rate-limiter";
//import { upload } from "../middleware/multer.middleware";

export function authRoutes(rateLimiters: ReturnType<typeof createRateLimiters>) {
    const router = Router();

    //router.post("/register", upload.single("image"), registerUserHandler);
    router.post("/register", validateRequest(registerSchema), registerUserHandler);
    router.post("/login", rateLimiters.loginRateLimiter, validateRequest(loginSchema), loginUserHandler);
    router.get("/verify-email", verifyUserEmailHandler);
    router.post("/refresh-token", refreshTokenHandler);
    router.post("/logout", verifyToken, logoutUserHandler);
    router.post("/logout-all", verifyToken, logoutAllHandler);
    router.post("/forgot-password", forgotPasswordHandler);
    router.post("/reset-password", validateRequest(resetPasswordSchema), resetPasswordHandler);
    router.post("/change-password", verifyToken, validateRequest(changePasswordSchema), changePasswordHandler);
    router.get("/me", verifyToken, getMe);
    router.get("/audit-logs", verifyToken, getAllAuditLogs);

    return router;
};