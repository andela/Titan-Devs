import { isEmpty } from "../../helpers/funcValidators";

export default class SignupValidator {
  static allAttributes(req, res, next) {
    const { email, password, firstName, lastName } = req.body;
    const errors = {};
    if (isEmpty(email)) errors.email = "Email is required";
    if (isEmpty(password)) errors.password = "Password is required";
    if (isEmpty(firstName)) errors.firstName = "Firstname is required";
    if (isEmpty(lastName)) errors.lastName = "Lastname is required";

    return isEmpty(errors)
      ? next()
      : res.status(400).json({ message: "User registration failed", errors });
  }
}
