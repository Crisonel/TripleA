import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        content: {
            type: String
        },
        priority: {
            type: String,
            default: "",
            enum : ["","high","low","medium"]
        },
        tags: {
            type: String,
            default: ""
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {timestamps: true}
);

export const Todo = mongoose.model("User",userSchema);