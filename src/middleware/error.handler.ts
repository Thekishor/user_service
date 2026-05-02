import {Request, Response, NextFunction} from "express";
import {AppError} from "../lib/AppError"

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            message: err.message,
        })
    } else {
        res.status(500).json({
            message: "Internal server error",
        })
    }
}