import dotenv from "dotenv";
import { hashSync, genSaltSync, compareSync } from "bcrypt";
import jwt from "jsonwebtoken";
import models from "../models";
import resetPwdTemplate from "../helpers/resetPasswordTemplate";
import template from "../helpers/emailVerificationTamplate";
import { isEmailValid } from "../helpers/funcValidators";
import { sendEmail } from "../services/sendgrid";

dotenv.config();

const { User } = models;

/**
 * @class UserController
 */
class UserController {
  /**
   * @description It resets the user's password.
   * @param  {Object} req - The request object.
   * @param  {Object} res - The response object.
   * @returns {Object} - It returns the response object.
   */

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
          { returning: true }
        );
        const { id, email, resetToken } = user.dataValues;
        const emailBody = await resetPwdTemplate(token);
        const emailResponse = await sendEmail(email, "Password Reset", emailBody);

        if (
          (emailResponse.length > 0 && emailResponse[0].statusCode === 202) ||
          emailResponse[emailResponse.length - 1].mockResponse
        ) {
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

  /**
   * @description It updates a reset password.
   * @param  {Object} req - The request object.
   * @param  {Object} res - The response object.
   * @returns {Object} - It returns the response object.
   */

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
          if (newPWdMatchCurrent) {
            return res.status(400).json({
              message: "Your new password was the same as your current one"
            });
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

  static async resendVerificationEmail(req, res) {
    try {
      const { email } = req.body;
      if (!email) return res.status(404).json({ message: "Email is required" });
      if (!isEmailValid(email))
        {return res.status(404).json({ message: "Invalid email" });}
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
            return res.status(404).json({ message: "Token is invalid" });
          }
          const verifiedUser = await User.findOne({
            where: { id: user.id, email: user.email }
          });
          if (error) {
            return res
              .status(401)
              .json({ message: "Token is invalid or expired, try again" });
          }
          if (!verifiedUser) {
            return res
              .status(404)
              .json({ message: "User verification failed, User was not found" });
          }
          if (verifiedUser.dataValues.isVerified) {
            return res.status(202).json({
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
