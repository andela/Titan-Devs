import dotenv from "dotenv";
import { hashSync, genSaltSync } from "bcrypt";
import jwt from "jsonwebtoken";
import models from "../models";
<<<<<<< HEAD
<<<<<<< HEAD
import resetPwdTamplage from "../helpers/resetPasswordTamplate";
=======
>>>>>>> #163518685 Add password reset email tamplate
=======
import resetPwdTamplage from "../helpers/resetPasswordTamplate";
>>>>>>> #163518685 Add mailer for password rest
import { sendEmail } from "../services/sendgrid";

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
        errors: error
      });
    }
  }

  static async resetPassword(req, res) {
<<<<<<< HEAD
    if (!req.body.email) {
      return res.status(400).json({ message: "Email is required" });
    }
    try {
      User.findOne({
        where: {
          email: req.body.email
        }
      }).then(async response => {
        if (!response) {
          return res.status(404).json({ message: "User not found" });
        }
        const token = await jwt.sign(req.body.email, process.env.SECRET_OR_KEY);
        const user = await response.update(
          { resetToken: token },
          { returining: true }
        );
        const { id, email, resetToken } = user.dataValues;
        const emailBody = await resetPwdTamplage(token);
        const emailResponse = await sendEmail(email, "Password Reset", emailBody);
        if (emailResponse.length > 0 && emailResponse[0].statusCode === 202) {
          res.json({
            message: "Mail delivered",
            user: { id, email, resetToken }
          });
        } else {
          res
            .status(500)
            .json({ message: "Error while sending email", data: emailResponse });
        }
      });
    } catch (error) {
=======
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    try {
      const user = await User.findOne({
        where: {
          email
        }
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const token = await jwt.sign(email, process.env.SECRET_OR_KEY);
      const emailBody = await resetPwdTamplage(token);
      const emailResponse = await sendEmail(email, "Password Reset", emailBody);
      if (emailResponse.length > 0 && emailResponse[0].statusCode === 202) {
        res.json({ message: "Password rest link sent", token });
      } else {
        res
          .status(500)
          .json({ message: "Error while sending email", data: emailResponse });
      }
    } catch (error) {
      console.log(error);
>>>>>>> #163518685 Add mailer for password rest
      res.status(500).json({ message: "Unknown error occurred" });
    }
  }

  static async updatePassword(req, res) {
    const { token } = req.params;
    try {
      await jwt.verify(token, process.env.SECRET_OR_KEY, async (error, email) => {
        if (error) {
<<<<<<< HEAD
          return res.status(400).json({ message: "Invalid or expired link" });
=======
          return res
            .status(400)
            .json({ message: "Invalid or experied token provided" });
>>>>>>> #163518685 Add mailer for password rest
        }
        const salt = await genSaltSync(
          parseFloat(process.env.BCRYPT_HASH_ROUNDS) || 10
        );
        const password = await hashSync(req.body.password, salt);
<<<<<<< HEAD
        User.findOne({
          where: {
            email,
            resetToken: token
          }
        }).then(async response => {
          if (!response) {
            return res.status(400).json({ message: "Link expired" });
          }
          await response.update({ password, resetToken: null });
          return res.json({ message: "Password updated" });
        });
=======
        const user = await User.update(
          { password },
          {
            where: {
              email
            }
          }
        );
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        return res.json({ message: "Password updated" });
>>>>>>> #163518685 Add mailer for password rest
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Password update failed", errors: error.stack });
    }
  }
}

export default UserController;
