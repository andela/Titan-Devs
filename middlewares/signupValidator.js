import constants from "../helpers/constants";
import { isEmpty, isEmailValid, isAlphanumeric } from "../helpers/funcValidators";

const { BAD_REQUEST, CONFLICT } = constants.statusCode;

export default class SignupValidator {
  static async allAttributes(req, res, next) {
    const { email, password, username } = req.body;
    const errors = {};
    if (isEmpty(email)) errors.email = "Email is required";
    if (isEmpty(password)) errors.password = "Password is required";
    if (isEmpty(username)) errors.username = "Username is required";
    return isEmpty(errors)
      ? next()
      : res
          .status(BAD_REQUEST)
          .json({ message: "User registration failed", errors });
  }

  static validateEmail(req, res, next) {
    const { email } = req.body;
    return isEmailValid(email)
      ? next()
      : res.status(BAD_REQUEST).json({ message: "Invalid email" });
  }

  static validateNewPassword(req, res, next) {
    const { newPassword, currentPassword } = req.body;
    if (newPassword === null || currentPassword === null) {
      return res.status(BAD_REQUEST).json({
        message: "Null values are not allowed!"
      });
    }
    if (!currentPassword || !newPassword) {
      return res.status(BAD_REQUEST).json({
        message: "Current and new password are required fields"
      });
    }
    const isPassword = isAlphanumeric(newPassword) && newPassword.trim().length >= 8;
    return isPassword
      ? next()
      : res.status(BAD_REQUEST).json({
          message:
            "The password should be an alphanumeric with at least 8 characters"
        });
  }

  static validatePassword(req, res, next) {
    const { password } = req.body;
    const isPassword = isAlphanumeric(password) && password.trim().length >= 8;
    return isPassword
      ? next()
      : res.status(BAD_REQUEST).json({
          message:
            "The password should be an alphanumeric with at least 8 characters"
        });
  }

  static validateUsername(req, res, next) {
    const { username } = req.body;
    return isAlphanumeric(username) && /[a-z]/i.test(username.trim()[0])
      ? next()
      : res.status(CONFLICT).json({
          message:
            "The username must begin with letter and only contains alphabet and numbers not symbols"
        });
  }
}
