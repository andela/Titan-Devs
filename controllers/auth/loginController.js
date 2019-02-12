import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import models from "../../models";
import validate from "../../helpers/validators/login.validation";

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
        bcrypt.compare(password, result.dataValues.password, (erro, response) => {
          if (response) {
<<<<<<< HEAD
            const { username, id } = result.dataValues;
=======
            let { email, username, id } = result.dataValues;
>>>>>>> #163518685 Change SECRET_KEY to SECRET_OR_KEY
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
