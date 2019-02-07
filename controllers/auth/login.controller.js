import models from "../../models";
import validate from "../../helpers/validators/login.validation";

const { User } = models;
/** Define class for handling user login */

class Login {
  static authenticate(req, res) {
    const { email, password } = req.body;
    /** Validate the email and password before any action */
    const err = validate(email, password);
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    /** Find if the user exists */
    User.findOne({ where: { email }, attributes: ["email", "password", "id"] })
      .then(result => {
        if (!result) {
          return res.status(404).json({ message: "Invalid email or password!" });
        }
        if (result.dataValues.password === password) {
          return res
            .status(200)
            .send({ message: "Logged in successffully", token: result.dataValues });
        }
        return res.status(400).json({ message: "Invalid email or password!" });
      })
      .catch(error => {
        return res.status(500).json({ error: error.message });
      });
  }
}

export default Login;
