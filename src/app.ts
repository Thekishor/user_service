import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes";
import {errorHandler} from "./middleware/error.handler";
import userRouter from "./routes/user.routes";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/health", (req, res) => {
    res.json({
        status: "ok"
    })
})

app.use("/api/users/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/admin", authRouter);

app.use(errorHandler);

export default app;