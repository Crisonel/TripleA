import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

//routes import
import userRouter from './routes/user.routes.js';


//routes declaration
app.use("/users", userRouter);
export {app};