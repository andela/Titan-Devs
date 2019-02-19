import models from "../models";
import validation from "../middlewares/updateProfileValidator";

const { User } = models;

/**
 * Profile Class
 *
 * @class
 */
class Profile {
  /**
   *
   * Update profile.
   *
   * @param  {Object} req - The request object.
   * @param  {Object} res - The response object.
   * @return {Object} - It returns the response object.
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
   *
   * GetProfile.
   *
   * @param  {Object} req - The request object.
   * @param  {Object} res - The response object.
   * @return {Object} - It returns the response object.
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
   *
   * GetAllProfiles.
   *
   * @param  {Object} req - The request object.
   * @param  {Object} res - The response object.
   * @return {Object} - It returns the response object.
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
   *
   * Delete.
   *
   * @param  {Object} req - The request object.
   * @param  {Object} res - The response object.
   * @return {Object} - It returns the response object.
   */
  static async delete(req, res) {
    const { username } = req.params;
    const usernameFromToken = req.user.username;
    if (username !== usernameFromToken) {
      return res.status(403).json({ message: "Unauthorized request" });
    }
    try {
      const deletedUser = await User.destroy({
        where: { username }
      });
      if (deletedUser === 0) {
        throw new Error("There no user with that username");
      }
      res.status(200).json({ message: "Profile deleted successfully" });
    } catch (error) {
      if (error.message === "There no user with that username") {
        return res.status(400).json({ message: `There no user with that username` });
      }
      res.status(500).json({ message: "Error happened", error });
    }
  }
}

export default Profile;
