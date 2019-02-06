import { Router } from "express";
import userController from "../controllers/users";
import Login from "../controllers/auth/login.controller";

const userRouters = Router();

userRouters.get("/users/:userId", userController.findOne);
/** define login route */
userRouters.post("/users/login", Login.authenticate);

export default userRouters;
