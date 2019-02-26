import models from "../models";
import validation from "../middlewares/updateProfileValidator";

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
      return res.status(400).json({ error: newUser.error });
    }
    if (usernameFromToken !== usernameParameter) {
      return res.status(403).json({ error: "Not authorized" });
    }

    try {
      const updatedProfile = await User.update(newUser, {
        returning: true,
        where: { username: usernameFromToken }
      });
      const newProfile = updatedProfile[1][0];
      return res
        .status(200)
        .json({ message: "Profile updated successfully", profile: newProfile });
    } catch (error) {
      res.status(500).json({ error });
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
      return res.status(200).json({ profile });
    } catch (error) {
      if (error.message === "No user with that name") {
        return res.status(400).json({ message: "No user with that name" });
      }
      return res.status(500).json({ message: "Error happened", error });
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
      return res.status(200).json({ profiles });
    } catch (error) {
      res.status(400).json({ error });
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
      return res.status(403).json({ error: "Unauthorized request" });
    }
    try {
      const deletedUser = await User.destroy({
        where: { username }
      });
      res.status(200).json({ message: "Profile deleted successfully", deletedUser });
    } catch (error) {
      res.status(500).json({ message: "Error happened", error });
    }
  }
}

export default Profile;
