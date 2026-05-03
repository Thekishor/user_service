import mongoose, {model} from "mongoose";

const sessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"],
    },
    refreshTokenHash: {
        type: String,
        required: [true, "Refresh token hash is required"],
    },
    ip: {
        type: String,
        required: [true, "IP address is required"],
    },
    userAgent: {
        type: String,
        required: [true, "UserAgent is required"],
    },
    revoked: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true
})

export const SessionModel = model("SessionModel", sessionSchema);