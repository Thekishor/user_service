import {Router} from "express";
import {
    registerUserHandler,
    verifyUserEmailHandler,
    loginUserHandler,
    refreshTokenHandler, logoutUserHandler, forgotPasswordHandler, resetPasswordHandler,
} from "../controllers/auth/auth.controller";

const authRouter = Router();

authRouter.post("/register", registerUserHandler);
authRouter.post("/login", loginUserHandler);
authRouter.get("/verify-email", verifyUserEmailHandler);
authRouter.post("/refresh", refreshTokenHandler);
authRouter.post("/logout", logoutUserHandler);
authRouter.post("/forgot-password", forgotPasswordHandler);
authRouter.post("/save-password", resetPasswordHandler);


export default authRouter;