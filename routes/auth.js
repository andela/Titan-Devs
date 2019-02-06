import { Router } from "express";
import AuthController from "../controllers/auth/authController";
import SignupValidation from "../middlewares/validation/signup.validator";

const authRouters = Router();

authRouters.post(
  "/auth/signup",
  SignupValidation.allAttributes,
  AuthController.signUp
);

export default authRouters;
