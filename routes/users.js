import { Router } from "express";
import Login from "../controllers/auth/loginController";
import SignUpController from "../controllers/auth/signupController";
import UserController from "../controllers/usersController";
import SignupValidation from "../middlewares/signupValidator";
import validator from "../middlewares/modelValidator";

const userRouters = Router();

userRouters.get("/users/confirm/:auth_token", UserController.confirmation);
userRouters.put("/users/resend", UserController.resendVerificationEmail);
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
userRouters.get(
  "/users/:userId/roles",
  validator.checkUser,
  UserController.getUserRoles
);
export default userRouters;
