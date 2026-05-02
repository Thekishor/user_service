import {Request, Response, NextFunction} from "express";
import {verifyAccessToken} from "../lib/jwt.tokens";
import {User} from "../models/user.model";
import {AppError} from "../lib/AppError";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                role: string;
                name: string;
                isEmailVerified: boolean;
            };
        }
    }
}

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Token is missing or invalid"
        })
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = verifyAccessToken(token);

        const user = await User.findById(payload.sub);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            })
        }

        req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
            isEmailVerified: user.isEmailVerified
        }

        next();
    } catch (error) {
        console.log(error);
        throw new AppError("Unauthorized user", 401);
    }
}

export default verifyToken;