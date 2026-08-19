import mongoose, { model } from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    isAccountActive: {
        type: Boolean,
        default: false,
    },
    tokenVersion: {
        type: Number,
        default: 0,
    },
    imageUrl: {
        type: String,
        default: null,
    },
    imagePublicId: {
        type: String,
        default: null,
    },
}, {
    timestamps: true
})

export const User = model("User", userSchema);