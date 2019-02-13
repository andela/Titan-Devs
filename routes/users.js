import { Router } from "express";
import Login from "../controllers/auth/loginController";
import UserController from "../controllers/users";
// middelwares
import SignupValidation from "../middlewares/validators/signup.validator";

const userRouters = Router();

<<<<<<< HEAD
=======
userRouters.post(
  "/users",
  SignupValidation.allAttributes,
  SignupValidation.validateEmail,
  SignupValidation.validatePassword,
  SignupValidation.validateUsername,
  UserController.signUp
);
// userRouters.post("/users/confirm/:auth_token", UserController.confirmation);
>>>>>>> [ft #[163518683] fix failed text
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
export default userRouters;
