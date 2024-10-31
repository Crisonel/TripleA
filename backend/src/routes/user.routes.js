import {Router} from "express";
import { registerUser,login, logout, refreshAccessToken, updateInformation } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);

router.route("/login").post(login);


//secured routes
router.route("/logout").post(verifyJWT, logout);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/update-user").post(verifyJWT, updateInformation);



export default router