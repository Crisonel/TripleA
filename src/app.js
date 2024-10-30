import express from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

//routes import
import userRouter from './routes/user.routes.js';


//routes declaration
app.use("/users", userRouter);
export {app};