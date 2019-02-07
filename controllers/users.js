import dotenv from "dotenv";
import { hashSync, genSaltSync } from "bcrypt";
import models from "../models";

dotenv.config();
const { User } = models;

class UserController {
  static async signUp(req, res) {
    const { email, password, username } = req.body;
    try {
      const salt = await genSaltSync(
        parseFloat(process.env.BCRYPT_HASH_ROUNDS) || 10
      );
      const hashPassword = await hashSync(password, salt);
      const user = await User.create({
        username,
        email,
        password: hashPassword
      });
      return res.json({
        message: "User registered successfully",
        user: {
          id: user.id,
          email: user.email,
          username: user.username
        }
      });
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        const { message } = error.errors[0];
        return res.status(400).json({ message });
      }
      res.status(500).json({
        message: "User registration failed, try again later!",
        errors: error
      });
    }
  }
}

export default UserController;
