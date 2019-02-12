// import models from "../models/index";
import models from "../models";
import validation from "../middlewares/validators/updateProfileValidator";
const { User } = models;
console.log(User);

/** Define the class for creating the profile
 * @params request
 * @params response
 */
class Profile {
  /** Define the function for updating the profile */
  static async update(req, res) {
    let usernameParameter = req.params.username;
    let usernameFromtoken = req.headers.username;
    let {
      username,
      firstname,
      lastname,
      image,
      bio,
      following,
      gender,
      phone,
      address
    } = req.body;
    let newInfo = {
      username,
      firstname,
      lastname,
      image,
      bio,
      following,
      gender,
      phone,
      address
    };
    let newUser = validation(newInfo);
    if (usernameFromtoken != usernameParameter) {
      return res.status(403).json({ error: "Not authorized" });
    }

    try {
      let updatedProfile = await User.update(newUser, {
        returning: true,
        where: { username: usernameFromtoken }
      });
      let newProfile = updatedProfile[1][0];
      return res.status(200).json({ newProfile });
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
      return res.status(200).json({ profile });
    } catch (error) {
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
    let usernameFromToken = req.headers.username;
    if (username != usernameFromToken) {
      return res.status(403).json({ message: "Unauthorized request" });
    }

    try {
      const deletedUser = await User.destroy({
        returning: true,
        where: { username }
      });
      res.status(200).json({ message: "Profile deleted successfully", deletedUser });
    } catch (error) {
      res.status(500).json({ message: "Error happened", error });
    }
  }
}

export default Profile;
