import { model, Schema } from "mongoose";

const noteSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    title: {
        type: String,
        required: true,
        trim: true,
        max_length: 150,
    },

    content: {
        type: String,
        required: true,
    },

    color: {
        type: String,
        default: "default",
    },

    isPinned: {
        type: Boolean,
        default: false,
    },

    isArchived: {
        type: Boolean,
        default: false,
    },

    tags: {
        type: [String],
        default: [],
    },
},
    { timestamps: true }
)

export const Note = model("Note", noteSchema);