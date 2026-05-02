import mongoose, {model} from 'mongoose'

const passwordResetModel = new mongoose.Schema({
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

export const PasswordResetModel = model("PasswordResetModel", passwordResetModel);