import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});

        return {accessToken,refreshToken};


    } catch (error) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

const registerUser = async (req,res) => {
    try {
            //get user details from frontend
            //check if user already exists
            //if yes print user exists
            //else create and the user

            //got details
            const {username, email, password} = req.body;

            //validation
            if(
                [username, email, password].some((field) => field?.trim() === "")
            ){
                console.log("All fields are required");
                return res.status(400).json({
                    success: false,
                    message: "All fields are required"
                });
            }

            const exists = await User.findOne({ email });

            if(exists){
                console.log("user exists");
                return res.status(400).json({
                    success: false,
                    message: "User already exists"
                });
            }

            const user = await User.create({
                username, email, password
            });

            const created = await User.findById(user._id).select(
                "-refreshToken"
            );

            if(!created){
                return res.status(500).json({
                    success: false,
                    message: "User can not be created"
                });
            }

            const loginReq = { body: { email, password } }; // Create a mock request object
            await login(loginReq, res);

            return res.status(201).json({
                created
            });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}


const login = async (req,res) => {
    try {
        
        //got details
        const {email, password} = req.body;

        //validation
        if(
            [email, password].some((field) => field?.trim() === "")
        ){
            console.log("All fields are required");
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const exists = await User.findOne({ email }).select("+password");

            if(!exists){
                console.log("user does not exist");
                return res.status(400).json({
                    success: false,
                    message: "User does not exist"
                });
            }

        const validPassword = await exists.isPasswordCorrect(password);

        if(!validPassword){
            console.log("Invalid Credentials");
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials"
            });
        }

        const{accessToken,refreshToken} = await generateAccessAndRefreshToken(exists._id);

        const options = {
            httpOnly: true,
            secure: true
        };
        

        return res.status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
            exists
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

const logout = async (req,res) => {
    User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        }
    );

    const options = {
        httpOnly: true,
        secure: true
    };

    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({
        message: "Logged Out successfully"
    });
}

const refreshAccessToken = async(req,res) => {
    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

        const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decodedToken._id);

        if(!user){
            console.log("Invalid refresh token");
            return res.status(401);
        }

        if(incomingRefreshToken !== user.refreshToken){
            console.log("Refresh Token is expired");
            return res.status(401);
        }

        const{newAccessToken,newRefreshToken} = await generateAccessAndRefreshToken(user._id);

        const options = {
            httpOnly: true,
            secure: true
        };
        

        return res.status(200)
        .cookie("accessToken", newAccessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json({
            user
        });



    } catch (error) {
        console.log("Invalid refresh token")
    }
}


const updateInformation = async(req,res) => {
    try {
        const {newUsername, newPassword, oldPassword} = req.body;
        const user = await User.findById(req.user?._id).select("+password");

        if(!(await user.isPasswordCorrect(oldPassword)) && newPassword !== "") user.password = newPassword;
        if((user.username !== newUsername.trim) && newUsername.trim !== "") user.username = newUsername;

        await user.save({validateBeforeSave: false});//save will need all the compulsory field what if password is not changed

        console.log("user updated!");

        return res.status(201).json({
            message: "user updated!"
        })

    } catch (error) {
        console.log("Can not update user", error);
    }
}

export {registerUser, login, logout, refreshAccessToken, updateInformation};