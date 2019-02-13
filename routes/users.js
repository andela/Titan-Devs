import { Router } from "express";
import Login from "../controllers/auth/loginController";
import UserController from "../controllers/users";
// middelwares
import SignupValidation from "../middlewares/validators/signup.validator";

const userRouters = Router();

userRouters.get("/users/confirm/:auth_token", UserController.confirmation);
userRouters.put("/users/resend", UserController.resendVerificationEmail);
userRouters.post("/users/login", Login.signIn);
userRouters.post(
  "/users",
  SignupValidation.allAttributes,
  SignupValidation.validateEmail,
  SignupValidation.validatePassword,
  SignupValidation.validateUsername,
  UserController.signUp
);
export default userRouters;
