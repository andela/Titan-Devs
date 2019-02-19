import dotenv from "dotenv";
import { hashSync, genSaltSync, compareSync } from "bcrypt";
import jwt from "jsonwebtoken";
import models from "../models";
import resetPwdTemplate from "../helpers/resetPasswordTemplate";
import template from "../helpers/emailVerificationTamplate";
import { isEmailValid } from "../helpers/funcValidators";
import { sendEmail } from "../services/sendgrid";
import constants from "../helpers/constants";

const {
  NOT_FOUND,
  BAD_REQUEST,
  ACCEPTED,
  OK,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED
} = constants.statusCode;

dotenv.config();

const { User } = models;

/**
 * @class UserController
 */
class UserController {
  /**
   *
   * ResetPassword.
   * @description this function helps to reset password
   * @param  {Object} req - The request object.
   * @param  {Object} res - The response object.
   * @returns {Object} - It returns the response object.
   */

  static async signUp(req, res) {
    const { email, password, username } = req.body;
    console.log(`expected email and password ${email} ${password} ${username}`);
    try {
      const salt = await genSaltSync(
        parseFloat(process.env.BCRYPT_HASH_ROUNDS) || 10
      );

      const hashPassword = await hashSync(password, salt);
      console.log(
        `........................trying to create a user in users.js ${(hashPassword,
        username,
        email)}`
      );
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
        if (message === "email must be unique") {
          errorMessage = "The email is already taken";
        }
        if (message === "username must be unique") {
          errorMessage = "The username is already taken";
        }
        return res.status(409).json({ message: errorMessage });
      }
      res.status(500).json({
        message: "User registration failed, try again later!",
        errors: error
      });
    }
  }

  static async resetPassword(req, res) {
    if (!req.body.email) {
      return res.status(NOT_FOUND).json({ message: "Email is required" });
    }
    try {
      User.findOne({
        where: {
          email: req.body.email
        }
      }).then(async response => {
        if (!response) {
          return res.status(NOT_FOUND).json({ message: "User not found" });
        }
        const token = await jwt.sign(req.body.email, process.env.SECRET_KEY);
        const user = await response.update(
          { resetToken: token },
          { returning: true }
        );
        const { id, email, resetToken } = user.dataValues;
        const emailBody = await resetPwdTemplate(token);
        const emailResponse = await sendEmail(email, "Password Reset", emailBody);

        if (
          (emailResponse.length > 0 && emailResponse[0].statusCode === ACCEPTED) ||
          emailResponse[emailResponse.length - 1].mockResponse
        ) {
          res.json({
            message: "Mail delivered",
            user: { id, email, resetToken }
          });
        } else {
          res
            .status(INTERNAL_SERVER_ERROR)
            .json({ message: "Error while sending email", data: emailResponse });
        }
      });
    } catch (error) {
      res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: "Sending email failed", errors: "Something happened, please try again" });
    }
  }

  /**
   *
   * UpdatePassword.
   * @description this function helps to update new password
   * @param  {Object} req - The request object.
   * @param  {Object} res - The response object.
   * @returns {Object} - It returns the response object.
   */

  static async updatePassword(req, res) {
    const { token } = req.params;
    try {
      await jwt.verify(token, process.env.SECRET_KEY, async (error, email) => {
        if (error) {
          return res
            .status(BAD_REQUEST)
            .json({ message: "Invalid or expired link" });
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
            return res.status(BAD_REQUEST).json({ message: "Link expired" });
          }
          const newPWdMatchCurrent = await compareSync(
            req.body.password,
            response.password
          );
          if (newPWdMatchCurrent) {
            return res.status(BAD_REQUEST).json({
              message: "Your new password was the same as your current one"
            });
          }
          await response.update({ password, resetToken: null });
          return res.json({ message: "Password updated" });
        });
      });
    } catch (error) {
      res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: "Password update failed", errors: "Something happened, please try again" });
    }
  }
  /**
   *
   * resendVerificationEmail.
   * @description this function helps to resend the email for verification after signing up
   * @param  {Object} req - The request object.
   * @param  {Object} res - The response object.
   * @return {Object} - It returns the response object.
   */

  static async resendVerificationEmail(req, res) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(BAD_REQUEST).json({ message: "Email is required" });
      }
      if (!isEmailValid(email)) {
        return res.status(BAD_REQUEST).json({ message: "Invalid email" });
      }
      const user = await User.findOne({
        where: { email }
      });
      if (!user) {
        return res.status(NOT_FOUND).json({
          message: "User not found"
        });
      }
      if (user.dataValues.isVerified) {
        return res.status(OK).json({
          message: "User verified"
        });
      }
      const token = jwt.sign(
        { userId: user.dataValues.id, email: user.dataValues.email },
        process.env.SECRET_KEY
      );
      await sendEmail(email, "Confirm your email", template(token));
      return res.status(OK).json({
        message: "Email sent successufully"
      });
    } catch (error) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        message: error
      });
    }
  }
  /**
   *
   * confirmation.
   * @description this function let you verify your account.
   * @param  {Object} req - The request object.
   * @param  {Object} res - The response object.
   * @return {Object} - It returns the response object.
   */

  static async confirmation(req, res) {
    try {
      jwt.verify(
        req.params.auth_token,
        process.env.SECRET_KEY,
        async (error, user) => {
          if (!user) {
            return res.status(UNAUTHORIZED).json({ message: "Token is invalid" });
          }
          const verifiedUser = await User.findOne({
            where: { id: user.id, email: user.email }
          });
          if (error) {
            return res
              .status(UNAUTHORIZED)
              .json({ message: "Token is invalid or expired, try again" });
          }
          if (!verifiedUser) {
            return res
              .status(NOT_FOUND)
              .json({ message: "User verification failed, User was not found" });
          }
          if (verifiedUser.dataValues.isVerified) {
            return res.status(ACCEPTED).json({
              message: "User already verified!"
            });
          }
          await User.update({ isVerified: true }, { where: { id: user.id } });
          return res.status(OK).json({
            message: "Email confirmed successfully!"
          });
        }
      );
    } catch (error) {
      return res.status(INTERNAL_SERVER_ERROR).json({
        message: "Something happened, please try again"
      });
    }
  }
}

export default UserController;
