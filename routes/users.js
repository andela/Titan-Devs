import { Router } from "express";
import Login from "../controllers/auth/loginController";
import UserController from "../controllers/users";

import SignupValidation from "../middlewares/validators/signup.validator";

const userRouters = Router();

userRouters.post("/users/login", Login.signIn);
userRouters
  .post(
    "/users",
    SignupValidation.allAttributes,
    SignupValidation.validateEmail,
    SignupValidation.validatePassword,
    SignupValidation.validateUsername,
    UserController.signUp
  )
  .post("/users/reset_password", UserController.resetPassword)
  .put(
    "/users/:token/password",
    SignupValidation.validatePassword,
    UserController.updatePassword
  );
export default userRouters;
