import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { hashSync, genSaltSync } from "bcrypt";
import models from "../models";
import { sendEmail } from "../services/sendgrid";
import template from "../helpers/EmailVerificationTamplate";

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

      const token = jwt.sign(
        { userId: user.dataValues.id, email: user.dataValues.email },
        process.env.SECRET_OR_KEY
      );
      await sendEmail(email, "Confirm your email", template(token));
      return res.status(201).json({
        token,
        message: "User registered successfully",
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          isVerified: user.isVerified
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
      return res.status(500).json({
        message: "User registration failed, try again later!",
        errors: error.stack.Error
      });
    }
  }

  static async resendVerificationEmail(req, res) {
    try {
      const { email } = req.body;
      const user = await User.findOne({
        where: { email }
      });
      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      }
      if (user.dataValues.isVerified) {
        return res.status(200).json({
          message: "User already verified!"
        });
      }
      const token = jwt.sign(
        { userId: user.dataValues.id, email: user.dataValues.email },
        process.env.SECRET_OR_KEY
      );
      await sendEmail(email, "Confirm your email", template(token));
      return res.status(200).json({
        message: "Email sent successufully"
      });
    } catch (error) {
      return res.status(500).json({
        messege: error
      });
    }
  }

  static async confirmation(req, res) {
    try {
      jwt.verify(
        req.params.auth_token,
        process.env.SECRET_OR_KEY,
        async (error, user) => {
          if (!user) {
            return res.status(500).json({ message: "Token is invalid" });
          }
          const verifiedUser = await User.findOne({
            where: { id: user.userId, email: user.email }
          });
          if (error) {
            return res
              .status(500)
              .json({ message: "Token is invalid or expired, try again" });
          }
          if (!verifiedUser) {
            return res
              .status(404)
              .json({ message: "User verification failed, User was not found" });
          }
          if (verifiedUser.dataValues.isVerified) {
            return res.status(200).json({
              message: "User already verified!"
            });
          }
          await User.update({ isVerified: true }, { where: { id: user.id } });
          return res.status(200).json({
            message: "Email confirmed successfully!"
          });
        }
      );
    } catch (error) {
      return res.status(500).json({
        message: error
      });
    }
  }
}
export default UserController;