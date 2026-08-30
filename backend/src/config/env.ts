import {z} from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
    PORT: z.string(),
    NODE_ENV: z.string(),
    MONGO_URI: z.string(),
    JWT_ACCESS_SECRET: z.string(),
    JWT_REFRESH_SECRET: z.string(),
    COOKIE_REFRESH_MAX_AGE: z.string().transform(Number),
    RESEND_API_KEY: z.string(),
    APP_URL: z.string(),
    FRONTEND_URL: z.string(),
    REDIS_URL: z.string(),
    DOMAIN: z.string(),
})

export const env = envSchema.parse(process.env);