import { Router } from "express";
import Login from "../controllers/auth/loginController";
import UserController from "../controllers/users";
// middelwares
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
<<<<<<< HEAD
// userRouters.get("/users/:userId", UserController.findOne);
=======
>>>>>>> 500522295e008cd74b6cb73621031258d7f0fe6c
export default userRouters;
