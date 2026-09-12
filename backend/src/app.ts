import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import { authRoutes } from "./routes/auth.routes.js";
import { errorHandler } from "./middleware/errorHandler.middleware.js";
import adminRouter from "./routes/admin.routes.js";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import logger from "./config/logger.js";
import { createRateLimiters } from "./config/rate-limiter.js";
import "./jobs/scheduler.js";

export const createApp = (rateLimiters: ReturnType<typeof createRateLimiters>) => {

    const app = express();

    app.set("trust proxy", 1);
    app.disable("x-powered-by");

    const allowedOrigins = [
        "http://localhost:5173",
        "https://user-service-bay.vercel.app",
    ];

    app.use(cors({
        origin: allowedOrigins,
        credentials: true,
    }));

    // helmet after cors so it doesn't interfere with CORS headers
    app.use(helmet());
    app.use(compression());
    app.use(express.json({
        limit: "20kb",
    }));
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());

    //request logging
    app.use((req: Request, res: Response, next: NextFunction) => {

        const start = Date.now();

        res.on("finish", () => {
            logger.info("HTTP Request Completed", {
                method: req.method,
                url: req.url,
                statusCode: res.statusCode,
                duration: `${Date.now() - start}ms`,
                ip: req.ip,
            })
        });

        next();
    });

    // global rate limiting first
    // protects every single route under /api/v1
    app.use("/api/v1", rateLimiters.globalRateLimiter);

    app.use("/api/v1/auth", authRoutes(rateLimiters));
    app.use("/api/v1/admin", adminRouter);

    app.use(errorHandler);

    return app;
}