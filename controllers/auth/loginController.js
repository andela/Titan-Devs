import models from "../../models";
import jwt from "jsonwebtoken";
import validate from "../../helpers/validators/login.validation";
import bcrypt from "bcrypt";

const { User } = models;
/**
 * Login Class
 *
 * @class
 */
class Login {
  /**
   *
   * SignIn
   *
   * @param  {object} req - The request object
   * @param  {object} res - The response object
   * @return {object} - It returns the response object
   */
  static signIn(req, res) {
    const { email, password } = req.body;
    const err = validate(email, password);
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    User.findOne({
      where: { email },
      attributes: ["email", "password", "username", "id"]
    })
      .then(result => {
        if (!result) {
          return res.status(404).json({ message: "Invalid email or password!" });
        }
        bcrypt.compare(password, result.dataValues.password, (error, response) => {
          if (response) {
            let { email, username, id } = result.dataValues;
            const token = jwt.sign(
              { email, username, id },
              process.env.SECRET_OR_KEY
            );
            return res.status(200).send({
              message: "Logged in successfully",
              token
            });
          }
          return res
            .status(400)
            .json({ message: "Invalid email or password!", error });
        });
      })
      .catch(error => {
        return res.status(500).json({ error: error.message });
      });
  }
}

export default Login;
