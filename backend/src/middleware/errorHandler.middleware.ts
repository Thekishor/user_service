import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { logError } from "../config/logger";

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {

    // Error handling
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            code: err.code,
            statusCode: err.statusCode,
            ... (err.details ? { errors: err.details } : {})
        });
    }

    // Invalid MongoDB ObjectId
    if (err.name === "CastError") {
        return res.status(404).json({
            success: false,
            message: "Resource not found",
            code: "RESOURCE_NOT_FOUND",
            statusCode: 404,
        });
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            code: "VALIDATION_ERROR",
            statusCode: 400
        });
    }

    // MongoDB duplicate key
    if ((err as any).code === 11000) {
        return res.status(409).json({
            success: false,
            message: "A resource with this information already exists",
            code: "DUPLICATE_RESOURCE",
            statusCode: 409
        });
    }

    // Unknown/unexpected error
    logError("Unknown error", err);

    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        code: "INTERNAL_SERVER_ERROR",
        statusCode: 500,
    });

}