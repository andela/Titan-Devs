import { Router } from "express";
import Login from "../controllers/auth/loginController";
import SignUpController from "../controllers/auth/signupController";
import UserController from "../controllers/usersController";
import SignupValidation from "../middlewares/signupValidator";

const userRouters = Router();

userRouters.post("/users/login", Login.signIn);
userRouters
  .post(
    "/users",
    SignupValidation.allAttributes,
    SignupValidation.validateEmail,
    SignupValidation.validatePassword,
    SignupValidation.validateUsername,
    SignUpController.signUp
  )
  .post("/users/reset_password", UserController.resetPassword)
  .put(
    "/users/:token/password",
    SignupValidation.validatePassword,
    UserController.updatePassword
  );
export default userRouters;
