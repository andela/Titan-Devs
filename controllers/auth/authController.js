import models from "../../models";

const { User } = models;
export default class AuthController {
  static async signUp(req, res) {
    const { firstName, lastName, email, password } = req.body;
    // const user = new User({ firstName, lastName, email, password });
    res.json({ message: "return message" });
  }
}
