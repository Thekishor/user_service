import mongoose, {model} from "mongoose";

const sessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"],
        index: true,
    },
    refreshTokenHash: {
        type: String,
        required: [true, "Refresh token hash is required"],
        index: true,
    },
    ip: {
        type: String,
        required: [true, "IP address is required"],
    },
    userAgent: {
        type: String,
    },
    revoked: {
        type: Boolean,
        default: false,
    },
    revokedAt: {
        type: Date,
    }
}, {
    timestamps: true
})

export const SessionModel = model("SessionModel", sessionSchema);