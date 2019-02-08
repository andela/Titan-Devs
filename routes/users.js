import { Router } from "express";
import UserController from "../controllers/users";
// middelwares
import SignupValidation from "../middlewares/validators/signup.validator";

const userRouters = Router();

userRouters.post(
  "/users",
  SignupValidation.allAttributes,
  SignupValidation.validateEmail,
  SignupValidation.validatePassword,
  SignupValidation.validateUsername,
  UserController.signUp
);
export default userRouters;
