import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

//routes import
import userRouter from './routes/user.routes.js';
import todoRouter from './routes/todo.routes.js';


//routes declaration
app.use("/users", userRouter);
app.use("/todos", todoRouter);
export {app};