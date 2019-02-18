import dotenv from "dotenv";
import { hashSync, genSaltSync, compareSync } from "bcrypt";
import jwt from "jsonwebtoken";
import models from "../models";
import resetPwdTemplate from "../helpers/resetPasswordTemplate";

import { sendEmail } from "../services/sendgrid";

dotenv.config();

const { User } = models;

/**
 * UserController
 *
 * @class
 */
class UserController {
  /**
   *
   * ResetPassword.
   *
   * @param  {object} req - The request object
   * @param  {object} res - The response object
   * @return {object} - It returns the response object
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
   *
   * UpdatePassword.
   *
   * @param  {object} req - The request object
   * @param  {object} res - The response object
   * @return {object} - It returns the response object
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
}

export default UserController;
