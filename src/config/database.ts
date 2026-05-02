import mongoose from "mongoose";
import {env} from "./env";

export async function connectToDB() {
    await mongoose.connect(env.MONGO_URI);
}