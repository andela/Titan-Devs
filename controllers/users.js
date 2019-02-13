import dotenv from "dotenv";
<<<<<<< HEAD
import { hashSync, genSaltSync, compareSync } from "bcrypt";
=======
import jwt from "jsonwebtoken";
import { hashSync, genSaltSync } from "bcrypt";
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> [ft #163518683] udpate user and delete token.
=======
<<<<<<< HEAD
>>>>>>> [ft #163518683] remove verification table logic
=======
>>>>>>> [ft #[163518683] fix failed text
import jwt from "jsonwebtoken";
let ExtractJwt = require("passport-jwt").ExtractJwt;
const sgMail = require("@sendgrid/mail");
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
<<<<<<< HEAD
<<<<<<< HEAD

      const token = jwt.sign(
        { userId: user.dataValues.id, email: user.dataValues.email },
        process.env.SECRET_OR_KEY
      );
      await sendEmail(email, "Confirm your email", template(token));
=======
      //create hashed verification token
      const token = jwt.sign({ id: user.dataValues.id }, process.env.SECRET_OR_KEY);
      await sendEmail(email, "Email Confirmation", template(token));
>>>>>>> [ft #163518683] remove verification table logic
=======

      const token = jwt.sign({ id: user.dataValues.id }, process.env.SECRET_OR_KEY);
      await sendEmail(email, "Email Confirmation", template(token));
      
>>>>>>> [ft #[163518683] fix failed text
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
<<<<<<< HEAD
      });
    }
  }

  static confirmation(req, res) {
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
        message: error.stack
=======
>>>>>>> [ft #163518683] remove verification table logic
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
<<<<<<< HEAD
<<<<<<< HEAD
      res.status(500).json({ message: "Sending email failed", errors: error.stack });
=======
      console.log(error);
=======
>>>>>>> #163518685 Add password validation on reset password
      res.status(500).json({ message: "Unknown error occurred" });
>>>>>>> #163518685 Add mailer for password rest
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
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> #163518685 Make password reset token one time usable
        }).then(async response => {
          if (!response) {
            return res.status(400).json({ message: "Link expired" });
          }
<<<<<<< HEAD
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
=======
        );
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        return res.json({ message: "Password updated" });
>>>>>>> #163518685 Add mailer for password rest
=======
          await response.update({ password, resetToken: null });
          return res.json({ message: "Password updated" });
        });
>>>>>>> #163518685 Make password reset token one time usable
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Password update failed", errors: error.stack });
    }
  }
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
}
<<<<<<< HEAD
=======
=======
};
>>>>>>> [ft #163518683] udpate user and delete token.
=======
};
=======
}
>>>>>>> [ft #163518683] remove verification table logic
>>>>>>> [ft #163518683] remove verification table logic

>>>>>>> #163518685 Add mailer for password rest
=======
};
>>>>>>> [ft #[163518683] fix failed text
export default UserController;
