import { Router } from "express";
import AuthController from "../controllers/auth/authController";
import SignupValidation from "../middlewares/validators/signup.validator";

const authRouters = Router();

authRouters.post(
  "/auth/signup",
  SignupValidation.allAttributes,
  SignupValidation.validateEmail,
  AuthController.signUp
);

export default authRouters;
