import dotenv from "dotenv";
import { hashSync, genSaltSync } from "bcrypt";
import jwt from "jsonwebtoken";
import models from "../../models";
import constants from "../../helpers/constants";
import sentEmailTemplate from "../../helpers/emailVerificationTamplate";
import { sendEmail } from "../../services/sendgrid";

const { ACCEPTED, INTERNAL_SERVER_ERROR, CREATED } = constants.statusCode;

const { User } = models;
dotenv.config();

export default class SignUpController {
  /**
   *
   * SignUp.
   *
   * @param  {Object} req - The request object.
   * @param  {Object} res - The response object.
   * @return {object} - It returns the response object.
   */
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
        process.env.SECRET_KEY
      );
      const emailBody = await sentEmailTemplate(token);
      const emailResponse = await sendEmail(email, "Email verification", emailBody);
      if (
        (emailResponse.length > 0 && emailResponse[0].statusCode === ACCEPTED) ||
        emailResponse[emailResponse.length - 1].mockResponse
      ) {
        res.status(CREATED).json({
          message:
            "We have sent an email with a confirmation link to your email address. Please allow 2-5 minutes for this message to arrive",
          user: {
            id: user.id,
            email: user.email,
            username: user.username
          }
        });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .json({ message: "User registered, please click resend email button" });
      }
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
      res.status(INTERNAL_SERVER_ERROR).json({
        message:
          "Sorry, this is not working properly. We now know about this mistake and are working to fix it"
      });
    }
  }
}
