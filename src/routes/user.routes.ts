import {Router, Request, Response} from "express";
import verifyToken from "../middleware/auth.middleware";

const userRouter = Router();

userRouter.get("/me",
    verifyToken,
    (req: Request, res: Response)=> {
    const user = req.user;
    return res.status(200).json(
        user
    );
});


export default userRouter;