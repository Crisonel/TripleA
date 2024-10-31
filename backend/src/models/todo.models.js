import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            trim: true,
            required: true
        },
        description:  {
            type: String,
            trim: true
        },
        content: {
            type: String,
            trim: true
        },
        priority: {
            type: String,
            default: "",
            enum : ["","high","low","medium"]
        },
        tags: [
            {
            type: String,
            default: ""
        }
        ],
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {timestamps: true}
);

export const Todo = mongoose.model("Todo",todoSchema);