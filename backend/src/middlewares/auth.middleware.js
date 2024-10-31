import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

export const verifyJWT = async(req,res,next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");

        if(!token){
            res.status(500).json({
                success: false,
                message: "Unauthorized request"
            });
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select("-refreshToken");

        if(!user){
            return res.status(400);
        }

        req.user = user;
        next();

    } catch (error) {
        console.log("Invalid Access Token ",error);
    }
}