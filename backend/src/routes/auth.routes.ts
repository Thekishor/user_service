import { Router } from "express";
import { getMe } from "../controllers/user.controller.js";
import {
    registerUserHandler,
    verifyUserEmailHandler,
    loginUserHandler,
    refreshTokenHandler,
    logoutUserHandler,
    forgotPasswordHandler,
    resetPasswordHandler,
    changePasswordHandler,
    logoutAllHandler,
    updateProfileHandler
} from "../controllers/auth.controller.js";
import verifyToken from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validate.middleware.js";
import { changePasswordSchema, loginSchema, profileSchema, registerSchema, resetPasswordSchema } from "../schema/auth.schema.js";
import { getAllAuditLogs } from "../controllers/auditLogs.controller.js";
import { createRateLimiters } from "../config/rate-limiter.js";
import { upload } from "../middleware/multer.middleware.js";

export function authRoutes(rateLimiters: ReturnType<typeof createRateLimiters>) {
    const router = Router();

    router.post("/register", validateRequest(registerSchema), registerUserHandler);
    router.post("/login", rateLimiters.loginRateLimiter, validateRequest(loginSchema), loginUserHandler);
    router.get("/verify-email", verifyUserEmailHandler);
    router.post("/refresh-token", refreshTokenHandler);
    router.post("/logout", verifyToken, logoutUserHandler);
    router.post("/logout-all", verifyToken, logoutAllHandler);
    router.post("/forgot-password", forgotPasswordHandler);
    router.post("/reset-password", validateRequest(resetPasswordSchema), resetPasswordHandler);
    router.post("/change-password", verifyToken, validateRequest(changePasswordSchema), changePasswordHandler);
    router.put("/profile", verifyToken, upload.single("image"), validateRequest(profileSchema), updateProfileHandler);
    router.get("/me", verifyToken, getMe);
    router.get("/audit-logs", verifyToken, getAllAuditLogs);

    return router;
};