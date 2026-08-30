import { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { redis } from "./redis.config";

const createRateLimitHandler = (message: string) => {
    return (req: Request, res: Response) => {
        const resetTime = req.rateLimit?.resetTime;

        const retryAfterSec = resetTime ?
            Math.ceil((resetTime.getTime() - Date.now()) / 1000)
            : 60;

        const retryAfterMin = Math.ceil(retryAfterSec / 60);

        return res.status(429).json({
            message: `${message} Please try again in ${retryAfterMin} minute${retryAfterMin > 1 ? "s" : ""}.`,
        });
    }
};

export function createRateLimiters() {
    return {

        //global rate limiter
        globalRateLimiter: rateLimit({
            windowMs: 60 * 1000,
            max: 1000,
            validate: { singleCount: false },
            standardHeaders: true,
            legacyHeaders: false,
            store: new RedisStore({
                sendCommand: (...args: string[]) => redis.sendCommand(args)
            }),
            handler: createRateLimitHandler("Too many requests."),
        }),

        // login rate limiter
        loginRateLimiter: rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 5,
            validate: { singleCount: false },
            standardHeaders: true,
            legacyHeaders: false,
            store: new RedisStore({
                sendCommand: (...args: string[]) => redis.sendCommand(args),
                prefix: "rl:login:",
            }),
            handler: createRateLimitHandler(
                "Too many login attempts.",
            ),
        }),
    }
}