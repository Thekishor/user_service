import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            code: err.code,
            statusCode: err.statusCode,
            ... (err.details ? {errors: err.details} : {})
        });
    }

    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        code: "INTERNAL_SERVER_ERROR",
        statusCode: 500,
    });

}