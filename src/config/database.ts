import mongoose from "mongoose";
import { env } from "./env";

export const connectToDB = async () => {
    await mongoose.connect(env.MONGO_URI);
}