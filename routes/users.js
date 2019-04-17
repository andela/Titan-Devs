import { Router } from "express";
import Login from "../controllers/auth/loginController";
import SignUpController from "../controllers/auth/signupController";
import UserController from "../controllers/usersController";
import SignupValidation from "../middlewares/signupValidator";
import checkAuth from "../middlewares/checkAuth";
import NotificationController from "../controllers/notificationController";
import validateRequest from "../middlewares/requestValidator/validateRequest";
import validator from "../middlewares/modelValidator";

const userRouters = Router();

userRouters.get("/users/confirm/:auth_token", UserController.confirmation);
userRouters.get("/users/current", checkAuth, UserController.current);
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
  )
  .put(
    "/users/:username/password/change",
    checkAuth,
    SignupValidation.validateNewPassword,
    UserController.changePassword
  )
  .put(
    "/users/:username/roles/:roleId",
    checkAuth,
    validator.checkUser,
    validator.checkRole,
    UserController.assignRole
  );
userRouters
  .route("/users/notifications/:notificationId", checkAuth)
  .delete(validateRequest, NotificationController.delete)
  .put(validateRequest, NotificationController.update)
  .get(NotificationController.fetchOne);
userRouters.get("/users/notifications", checkAuth, NotificationController.fetchAll);

export default userRouters;
