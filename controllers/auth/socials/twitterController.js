import createUserFromSocial from "./createUserFromSocial";
import constants from "../../../helpers/constants";

const { INTERNAL_SERVER_ERROR } = constants.statusCode;
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
    return res.status(INTERNAL_SERVER_ERROR).json({
      message:
        "Sorry, this is not working properly. We now know about this mistake and are working to fix it"
    });
  }
}

export default TwitterController;
