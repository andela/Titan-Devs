import models from "../models";
import validation from "../middlewares/updateProfileValidator";
import constants from "../helpers/constants";

const { INTERNAL_SERVER_ERROR, OK, BAD_REQUEST, FORBIDDEN } = constants.statusCode;
const { User } = models;

/**
 * @class Profile
 */
class Profile {
  /**
   * @description It updates the user's profile.
   * @param  {Object} req - The request object.
   * @param  {Object} res - The response object.
   * @returns {Object} - It returns the response object.
   */

  static async update(req, res) {
    const usernameParameter = req.params.username;
    const usernameFromToken = req.user.username;
    const newUser = validation(req.body.profile);
    if (newUser.error) {
      return res.status(BAD_REQUEST).json({ error: newUser.error });
    }
    if (usernameFromToken !== usernameParameter) {
      return res.status(FORBIDDEN).json({ error: "Not authorized" });
    }

    try {
      const updatedProfile = await User.update(newUser, {
        returning: true,
        where: { username: usernameFromToken }
      });
      const newProfile = updatedProfile[1][0];
      return res
        .status(OK)
        .json({ message: "Profile updated successfully", profile: newProfile });
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR).json({
        error:
          "Sorry, this is not working properly. We now know about this mistake and are working to fix it"
      });
    }
  }

  /**
   * @description Gets the user's profile
   * @param  {Object} req - The request object.
   * @param  {Object} res - The response object.
   * @returns {Object} - It returns the response object.
   */

  static async getProfile(req, res) {
    const { username } = req.params;
    try {
      const profile = await User.findOne({
        where: { username }
      });
      if (profile == null) {
        throw new Error("No user with that name");
      }
      return res.status(OK).json({ profile });
    } catch (error) {
      if (error.message === "No user with that name") {
        return res.status(BAD_REQUEST).json({ message: "No user with that name" });
      }
      return res.status(INTERNAL_SERVER_ERROR).json({
        message: "Error happened",
        error:
          "Sorry, this is not working properly. We now know about this mistake and are working to fix it"
      });
    }
  }

  /**
   * @description Gets profiles of all users.
   * @param  {Object} req - The request object.
   * @param  {Object} res - The response object.
   * @returns {Object} - It returns the response object.
   */

  static async getAllProfiles(req, res) {
    try {
      const profiles = await User.findAll();
      return res.status(OK).json({ profiles });
    } catch (error) {
      res
        .status(INTERNAL_SERVER_ERROR)
        .json({
          error:
            "Sorry, this is not working properly. We now know about this mistake and are working to fix it"
        });
    }
  }

  /**
   * @description It deletes a particular user's profile.
   * @param  {Object} req - The request object.
   * @param  {Object} res - The response object.
   * @returns {Object} - It returns the response object.
   */

  static async delete(req, res) {
    const { username } = req.params;
    const usernameFromToken = req.user.username;
    if (username !== usernameFromToken) {
      return res.status(FORBIDDEN).json({ message: "Unauthorized request" });
    }
    try {
      const deletedUser = await User.destroy({
        where: { username }
      });
      if (deletedUser === 0) {
        throw new Error("There no user with that username");
      }
      res.status(OK).json({ message: "Profile deleted successfully" });
    } catch (error) {
      if (error.message === "There no user with that username") {
        return res
          .status(BAD_REQUEST)
          .json({ message: `There no user with that username` });
      }
      res
        .status(INTERNAL_SERVER_ERROR)
        .json({
          message: "Error happened",
          error:
            "Sorry, this is not working properly. We now know about this mistake and are working to fix it"
        });
    }
  }
}

export default Profile;
