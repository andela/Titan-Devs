import { Router } from "express";
import UserController from "../controllers/users";
// middelwares
import SignupValidation from "../middlewares/validators/signup.validator";

const userRouters = Router();

userRouters.post(
  "/users",
  SignupValidation.allAttributes,
  SignupValidation.validateEmail,
  UserController.signUp
);
import userController from "../controllers/users";
import Login from "../controllers/auth/login.controller";

const userRouters = Router();

userRouters.get("/users/:userId", userController.findOne);
/** define login route */
userRouters.post("/users/login", Login.authenticate);

export default userRouters;
