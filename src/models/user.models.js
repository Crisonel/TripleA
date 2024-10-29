import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true,"Username required"]
    },
    email: {
        type: String,
        required: [true,"E-mail required"],
        unique: true
    },
    password: {
        type: String,
        required: [true,"Password required"],
        select: false
    }
});

export const User = mongoose.model("User",userSchema);