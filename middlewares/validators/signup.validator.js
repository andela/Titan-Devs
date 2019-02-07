import { isEmpty, isEmailValid } from "../../helpers/funcValidators";

export default class SignupValidator {
  static async allAttributes(req, res, next) {
    const { email, password, username } = req.body;
    const errors = {};
    if (isEmpty(email)) errors.email = "Email is required";
    if (isEmpty(password)) errors.password = "Password is required";
    if (isEmpty(username)) errors.username = "Username is required";
    // try {
    //   const result = await joi.validate(req.body, userSchema);
    //   console.log(result);
    // } catch (error) {
    //   const { message } = error.details[0];
    //   switch (message) {
    //     case JOI_ALPHANUMERIC_ERROR:
    //       return (errors.password = "Password should be alphanumeric");
    //     case JOI_INVALID_EMAIL_ERROR:
    //       return (error.email = "Invalid email");
    //     case JOI_SHORT_PASSWORD_ERROR:
    //       return (errors.password = "Password should be at least 8");
    //     default:
    //       return;
    //   }
    //   console.log(message);
    // }
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
