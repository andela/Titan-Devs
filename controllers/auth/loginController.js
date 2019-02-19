import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import models from "../../models";
import validate from "../../helpers/validators/loginValidators";

dotenv.config();

const { User } = models;
/**
 * Login Class
 *
 * @class
 */
class Login {
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
            const token = jwt.sign(
              {
                email: result.dataValues.email,
                username: result.dataValues.username,
                id: result.dataValues.id
              },
              process.env.SECRET_KEY
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
