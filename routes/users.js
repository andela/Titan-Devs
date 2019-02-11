import { Router } from "express";
import Login from "../controllers/auth/loginController";
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

userRouters.post("/users/login", Login.signIn);
export default userRouters;
