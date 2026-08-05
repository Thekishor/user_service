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
} from "../controllers/auth.controller";
import verifyToken from "../middleware/auth.middleware";
import { upload } from "../middleware/multer.middleware";

const authRouter = Router();

authRouter.post("/register", upload.single("image"), registerUserHandler);
authRouter.post("/login", loginUserHandler);
authRouter.get("/verify-email", verifyUserEmailHandler);
authRouter.post("/refresh", refreshTokenHandler);
authRouter.post("/logout", logoutUserHandler);
authRouter.post("/forgot-password", forgotPasswordHandler);
authRouter.post("/save-password", resetPasswordHandler);
authRouter.get("/me", verifyToken, getMe);

export default authRouter;