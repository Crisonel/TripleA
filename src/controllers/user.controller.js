import { User } from "../models/user.models.js";

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

        const exists = await User.findOne({ email });

            if(!exists){
                console.log("user does not exist");
                return res.status(400).json({
                    success: false,
                    message: "User does not exist"
                });
            }

        const checkPassword = isPasswordCorrect(exists);

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

export {registerUser, login};