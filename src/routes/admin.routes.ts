import {Router, Request, Response} from "express";
import verifyToken from "../middleware/auth.middleware";
import {roleMiddleware} from "../middleware/role.middleware";
import {User} from "../models/user.model";

const adminRouter = Router();

adminRouter.get("/users",
    verifyToken,
    roleMiddleware("/admin"),
    async (req: Request, res: Response) => {

        try {
            const users = await User.find(
                {},
                {
                    email: 1,
                    role: 1,
                    isEmailVerified: 1,
                    createdAt: 1
                }
            ).sort({createdAt: -1});

            const result = users.map(user => ({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                isEmailVerified: user.isEmailVerified,
                createdAt: user.createdAt
            }));

            return res.status(200).json({
                status: "success",
                users: result,
            });
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                status: "error",
                message: "Internal Server Error",
            })
        }

    }
)

export default adminRouter;