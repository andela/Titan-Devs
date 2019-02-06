import models from "../../models";

const { User } = models;

/** Define class for handling user login */

class Login {
  static async authenticate(req, res) {
    const { email, password } = req.body;
    const isEmpty = !email || !password ? "Provide valid credentials" : false;
    /** if the email or password is empty, return an error message */
    if (isEmpty) {
      return res.status(400).json({ message: isEmpty });
    }
    /** If password and email are not empty, use the email to search a user in database */
    try {
      const user = await User.findOne(
        { attributes: ["email", "password", "id"] },
        { where: { email } }
      );
      const error = !user ? "No user with that email" : false;
      if (error) {
        return res.status(404).json({ error });
      }
      if (user.password === password) {
        /** Create a token for a user and send it */
        return res
          .status(200)
          .send({ token: user, message: "Loged in successfully" });
      }
      return res.status(400).send({ message: "Wrong password, try again?" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default Login;
