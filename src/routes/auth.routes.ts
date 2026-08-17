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
//import { upload } from "../middleware/multer.middleware";

const authRouter = Router();

//authRouter.post("/register", upload.single("image"), registerUserHandler);
authRouter.post("/register", registerUserHandler);
authRouter.post("/login", loginUserHandler);
authRouter.get("/verify-email", verifyUserEmailHandler);
authRouter.post("/refresh-token", refreshTokenHandler);
authRouter.post("/logout", verifyToken, logoutUserHandler);
authRouter.post("/logout-all", verifyToken, logoutAllHandler);
authRouter.post("/forgot-password", forgotPasswordHandler);
authRouter.post("/reset-password", resetPasswordHandler);
authRouter.post("/change-password", verifyToken, changePasswordHandler);
authRouter.get("/me", verifyToken, getMe);

export default authRouter;