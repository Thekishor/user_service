import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes";
import { errorHandler } from "./middleware/error.handler";
import adminRouter from "./routes/admin.routes";
import compression from "compression";
import cors from "cors";
import { env } from "./config/env";
import logger from "./config/logger";

const app = express();
app.disable("x-powered-by");

app.use(cors({
    origin: [env.FRONTEND_URL],
    credentials: true,
}));

app.use(compression());
app.use(express.json());
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

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);

app.use(errorHandler);

export default app;