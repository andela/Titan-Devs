import { isEmpty, isEmailValid } from "../../helpers/funcValidators";

export default class SignupValidator {
  static allAttributes(req, res, next) {
    const { email, password, username } = req.body;
    const errors = {};
    if (isEmpty(email)) errors.email = "Email is required";
    if (isEmpty(password)) errors.password = "Password is required";
    if (isEmpty(username)) errors.username = "Username is required";

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
}
