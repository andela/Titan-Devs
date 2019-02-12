import models from "../../models";
import jwt from "jsonwebtoken";
import validate from "../../helpers/validators/login.validation";
import bcrypt from "bcrypt";

const { User } = models;
/** Define class for handling user login */

class Login {
  static signIn(req, res) {
    const { email, password } = req.body;
    /** Validate the email and password before any action */
    const err = validate(email, password);
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    /** Find if the user exists */
    User.findOne({
      where: { email },
      attributes: ["email", "password", "username", "id", "isVerified"]
    })
      .then(result => {
        if (!result) {
          return res.status(404).json({ message: "Invalid email or password!" });
        }
        if (!result.dataValues.isVerified) {
          return res.status(401).json({message: "User has not been verified, Please check your email" });
        }
        bcrypt.compare(password, result.dataValues.password, (erro, response) => {
          if (response) {
            let { email, username, id } = result.dataValues;
            const token = jwt.sign(
              { email, username, id },
              process.env.SECRET_OR_KEY
            );
            return res.status(200).send({
              message: "Logged in successffully",
              token
            });
          }
          return res
            .status(400)
            .json({ message: "Invalid email or password!", erro });
        });
      })
      .catch(error => {
        return res.status(500).json({ error: error.message });
      });
  }

}

export default Login;
