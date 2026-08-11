import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes";
import { errorHandler } from "./middleware/error.handler";
import adminRouter from "./routes/admin.routes";
import compression from "compression";
import cors from "cors";
import { env } from "./config/env";

const app = express();
app.disable("x-powered-by");

app.use(cors({
    origin: env.FRONTEND_URL,
    credentials: true,
}));

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter);

app.use(errorHandler);

export default app;