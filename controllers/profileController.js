// import models from "../models/index";
import models from "../models";
import validation from "../middlewares/validators/updateProfileValidator";
const { User, Follower } = models;
console.log(User);

/** Define the class for creating the profile
 * @params request
 * @params response
 */
class Profile {
  /** Define the function for updating the profile */
  static async update(req, res) {
    let usernameParameter = req.params.username;
    let usernameFromtoken = req.user.username;
    let newUser = validation(req.body.profile);
    if (newUser.error) {
      return res.status(400).json({ error: newUser.error });
    }
    if (usernameFromtoken != usernameParameter) {
      return res.status(403).json({ error: "Not authorized" });
    }

    try {
      let updatedProfile = await User.update(newUser, {
        returning: true,
        where: { username: usernameFromtoken }
      });
      let newProfile = updatedProfile[1][0];
      return res
        .status(200)
        .json({ message: "Profile updated successfully", profile: newProfile });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
  /** Define the function for getting a profile of a specific user */
  static async getProfile(req, res) {
    let { username } = req.params;
    try {
      const profile = await User.findOne({
        where: { username }
      });
      if (profile == null) {
        throw new Error("No user with that name");
      }
      return res.status(200).json({ profile });
    } catch (error) {
      if (error.message == "No user with that name") {
        return res.status(400).json({ message: "No user with that name" });
      }
      return res.status(500).json({ message: "Error happened", error });
    }
  }
  /** Define the function for retrieving all profiles
   * @params {} res
   */
  static async getAllProfiles(req, res) {
    try {
      const profiles = await User.findAll();
      return res.status(200).json({ profiles });
    } catch (error) {
      res.status(400).json({ error });
    }
  }
  /** Define the function for deleting a profile */
  static async delete(req, res) {
    let { username } = req.params;
    let usernameFromToken = req.user.username;
    if (username != usernameFromToken) {
      return res.status(403).json({ message: "Unauthorized request" });
    }

    try {
      const deletedUser = await User.destroy({
        where: { username }
      });
      if (deletedUser == 0) {
        throw new Error("There no user with that username");
      }
      res.status(200).json({ message: "Profile deleted successfully" });
    } catch (error) {
      if ((error.message = "There no user with that username")) {
        return res.status(400).json({ message: `There no user with that username` });
      }
      res.status(500).json({ message: "Error happened", error });
    }
  }
}

export default Profile;
