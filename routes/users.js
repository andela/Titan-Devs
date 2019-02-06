import { Router } from "express";
import userController from "../controllers/users";

const userRouters = Router();

userRouters.get("/users/:userId", userController.findOne);
export default userRouters;
