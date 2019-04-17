import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import models from "../../models";
import validate from "../../helpers/validators/loginValidators";
import constants from "../../helpers/constants";

const { INTERNAL_SERVER_ERROR, BAD_REQUEST, OK } = constants.statusCode;
dotenv.config();

const { User } = models;
/**
 * Login Class
 *
 * @class
 */
class LoginController {
  /**
   *
   * SignIn.
   *
   * @param  {Object} req - The request object.
   * @param  {Object} res - The response object.
   * @return {Object} - It returns the response object.
   */

  static signIn(req, res) {
    const { email, password } = req.body;
    const err = validate(email, password);
    if (err) {
      return res.status(BAD_REQUEST).json({ message: err.message });
    }
    User.findOne({
      where: { email },
      attributes: ["email", "password", "username", "id", "roleId"]
    })
      .then(result => {
        if (!result) {
          return res
            .status(BAD_REQUEST)
            .json({ message: "Invalid email or password!" });
        }
        bcrypt.compare(password, result.dataValues.password, (error, response) => {
          if (response) {
            const token = jwt.sign(
              {
                email: result.dataValues.email,
                username: result.dataValues.username,
                id: result.dataValues.id,
                roleId: result.dataValues.roleId
              },
              process.env.SECRET_KEY
            );
            return res.status(OK).send({
              message: "Logged in successfully",
              token
            });
          }
          return res
            .status(BAD_REQUEST)
            .json({ message: "Invalid email or password!", error });
        });
      })
      .catch(error => {
        return res.status(INTERNAL_SERVER_ERROR).json({
          message:
            "Sorry, this is not working properly. We now know about this mistake and are working to fix it",
          error
        });
      });
  }
}

export default LoginController;
