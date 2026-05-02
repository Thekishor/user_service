import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes";
import {errorHandler} from "./middleware/error.handler";
import userRouter from "./routes/user.routes";
import adminRouter from "./routes/admin.routes";

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
app.use("/api/admin", adminRouter);

app.use(errorHandler);

export default app;