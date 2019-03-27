import createUserFromSocial from "./createUserFromSocial";
import constants from "../../../helpers/constants";

const { INTERNAL_SERVER_ERROR } = constants.statusCode;
const { SERVER_ERROR } = constants.errorMessage;
class TwitterController {
  /**
   * @param {object} req - Request object
   * @param {object} res - Response object
   * @return {res} res - Response object
   * @memberof UserController
   */
  static async twitterLogin(req, res) {
    const user = await createUserFromSocial(req.user);
    if (user) {
      return res.redirect(`/api/v1/profiles/${user.username}`);
    }
    console.log("why are you return anything");
    return res.status(INTERNAL_SERVER_ERROR).json({
      message: SERVER_ERROR
    });
  }
}

export default TwitterController;
