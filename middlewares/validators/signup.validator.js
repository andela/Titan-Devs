import { isEmpty, isEmailValid, isAlphanumeric } from "../../helpers/funcValidators";

export default class SignupValidator {
  static allAttributes(req, res, next) {
    const { email, password, username, isVerified } = req.body;
    const errors = {};
    if (isEmpty(email)) errors.email = "Email is required";
    if (isEmpty(password)) errors.password = "Password is required";
    if (isEmpty(username)) errors.username = "Username is required";
    if (isEmpty(!isVerified))
      errors.isVerified = "Your account has not been verified";
    return isEmpty(errors)
      ? next()
      : res.status(400).json({ message: "User registration failed", errors });
  }

  static validateEmail(req, res, next) {
    const { email } = req.body;
    return isEmailValid(email)
      ? next()
      : res.status(400).json({ message: "Invalid email" });
  }

  static validatePassword(req, res, next) {
    const { password } = req.body;
    const isPassword = isAlphanumeric(password) && password.trim().length >= 8;
    return isPassword
      ? next()
      : res.status(400).json({
          message:
            "The password should be an alphanumeric with at least 8 characters"
        });
  }

  static validateUsername(req, res, next) {
    const { username } = req.body;
    return isAlphanumeric(username) && /[a-z]/i.test(username.trim()[0])
      ? next()
      : res.status(400).json({
          message:
            "The username must begin with letter and only contains alphabet and numbers not symbols"
        });
  }
}
