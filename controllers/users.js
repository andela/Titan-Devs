import dotenv from "dotenv";
import { hashSync, genSaltSync, compareSync } from "bcrypt";
import jwt from "jsonwebtoken";
import models from "../models";
import resetPwdTamplage from "../helpers/resetPasswordTamplate";
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
      //create hashed verification token
      const token = jwt.sign({ id: user.dataValues.id }, process.env.SECRET_OR_KEY);
      await sendEmail(email, "Email Confirmation", template(token));
      return res.status(201).json({
        message: "User registered successfully",
        user: {
          id: user.id,
          email: user.email,
          username: user.username
        }
      });
    } catch (error) {
      console.log(error.stack);
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

  static confirmation(req, res) {
    try {
      jwt.verify(
        req.params.auth_token,
        process.env.SECRET_OR_KEY,
        async (error, user) => {
          if (error) {
            return res.status(404).json({
              error: error.stack,
              message: "Token is Expired or Invalid signature"
            });
          }
          const verifiedUser = await User.findOne({
            where: { id: user.id }
          });
          if (!verifiedUser) {
            return res.status(409).json({ message: "User verification failed" });
          }
          // update user
          await User.update({ isVerified: true }, { where: { id: user.id } });
          return res.status(200).json({
            message: "Email confirmed successfully!"
          });
        }
      );
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: error.stack
      });
    }
  }
  static async resetPassword(req, res) {
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
      res.status(500).json({ message: "Sending email failed", errors: error.stack });
    }
  }

  static async updatePassword(req, res) {
    const { token } = req.params;
    try {
      await jwt.verify(token, process.env.SECRET_OR_KEY, async (error, email) => {
        if (error) {
          return res.status(400).json({ message: "Invalid or expired link" });
        }
        const salt = await genSaltSync(
          parseFloat(process.env.BCRYPT_HASH_ROUNDS) || 10
        );
        const password = await hashSync(req.body.password, salt);
        User.findOne({
          where: {
            email,
            resetToken: token
          }
        }).then(async response => {
          if (!response) {
            return res.status(400).json({ message: "Link expired" });
          }
          const newPWdMatchCurrent = await compareSync(
            req.body.password,
            response.password
          );
          if(newPWdMatchCurrent){
            return res.status(400).json({message:"Your new password was the same as your current one"})
          }
          await response.update({ password, resetToken: null });
          return res.json({ message: "Password updated" });
        });
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Password update failed", errors: error.stack });
    }
  }
};

export default UserController;
