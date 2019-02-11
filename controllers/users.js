import dotenv from "dotenv";
import { hashSync, genSaltSync } from "bcrypt";
import models from "../models";

dotenv.config();
const { User, VerificationToken } = models;

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
      sendVerificationEmail(user.id);
      return res.status(201).json({
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
        let errorMessage = message;
        if (message === "email must be unique")
          errorMessage = "The email is already taken";
        if (message === "username must be unique")
          errorMessage = "The username is already taken";
        return res.status(409).json({ message: errorMessage });
      }
      res.status(500).json({
        message: "User registration failed, try again later!",
        errors: error.stack
      });
    }
  }
}
const sendVerificationEmail = async (user) => {
  try {
    const salt = await genSaltSync(
      parseFloat(process.env.BCRYPT_HASH_ROUNDS) || 10
    );
     //create hashed verification token
     const verificationToken = await hashSync(user, salt);
     // saving token in db
     const verification = await VerificationToken.create({
       token: verificationToken,
       userId: user
     });
     console.log(verification);
  } catch (error) {
    console.log(error.stack);
  }
}

export default UserController;
