import {Router} from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createTodo, updateTodo, deleteTodo, loadTodos } from "../controllers/todo.controller.js";

const router = Router();

//secured routes
router.route("/load").post(verifyJWT, loadTodos);
router.route("/create").post(verifyJWT, createTodo);
router.route("/delete/:id").post(verifyJWT, deleteTodo);
router.route("/update/:id").post(verifyJWT, updateTodo);



export default router