import { Router } from "express";
import UserController from "../controllers/users.js";
import Login from "../controllers/auth/login.controller";
// middelwares
import SignupValidation from "../middlewares/validators/signup.validator";

const userRouters = Router();

userRouters.post(
  "/users",
  SignupValidation.allAttributes,
  SignupValidation.validateEmail,
  UserController.signUp
);

//userRouters.get("/users/:userId", UserController.findOne);
/** define login route */
userRouters.post("/users/login", Login.authenticate);

export default userRouters;
