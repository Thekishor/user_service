import mongoose, {model} from "mongoose";

const emailVerificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    }
}, {
    timestamps: true,
})

export const EmailVerificationModel = model("EmailVerificationModel", emailVerificationSchema)