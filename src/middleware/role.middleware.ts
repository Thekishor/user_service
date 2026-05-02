import {Request, Response, NextFunction} from "express";

export const roleMiddleware = (role: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;

        if (!user) {
            return res.status(401).json({
                status: "error",
                message: "User not found"
            })
        }

        if (user.role !== role) {
            res.status(403).send({
                message: "You do not have permission to access this resources",
            });
        }
        next();
    }
}