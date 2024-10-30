import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true,"Username required"],
        trim: true
    },
    email: {
        type: String,
        required: [true,"E-mail required"],
        unique: true,
        trim: true,
        lowercase: true,
        index: true
    },
    password: {
        type: String,
        required: [true,"Password required"],
        select: false
    },
    refreshToken: {
        type: String
    }
});

userSchema.pre("save", async function (next) {
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,5);
        next();
    }
});

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = async function(){
    return await jwt.sign(
        {
            _id: this._id,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "1d"
        }
    );
}

userSchema.methods.generateRefreshToken = async function(){
    return await jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: "10d"
        }
    );
}

export const User = mongoose.model("User",userSchema);