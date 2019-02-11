import models from "../models";
const User = { models };
class Profile {
  static async create(req, res) {
    let { username, id, image, bio, following } = req.body;
    let newProfile = await User.create({ username, id, image, bio, following });
    newProfile
      .then((error, result) => {
        if (result) res.status(201).json({ profile: result });
        res.status(400).json({ message: "Error happened", error });
      })
      .catch(error => res.status(500).json(error));
  }

  static async update(req, res) {
    let { username } = req.header;
    let { image, bio, following } = req.body;
    let updatedProfile = await User.update(
      { image, bio, following },
      { where: username }
    );
    updatedProfile
      .then((error, result) => {
        if (result) {
          res.status(200).json({ profile: result });
        }
        res.status(400).json({ message: "Error happened", error });
      })
      .catch(error => {
        res.status(500).json({ error });
      });
  }

  static async getProfile(req, res) {
    let { username } = req.header;
    if (!username) {
      const profiles = await User.findAll({
        attributes: ["image", "username", "bio", "following"]
      });
      profiles
        .then((error, result) => {
          if (result) res.status(200).json({ profiles: result });
          return res.status(400).json({ message: error });
        })
        .catch(error => {
          return res.status(500).json({ message: "Error happened", error });
        });
    }
    const profile = await User.findOne({
      where: { username },
      attributes: ["image", "username", "bio", "following"]
    });
    profile
      .then((error, result) => {
        if (result) res.status(200).json({ profiles: result });
        return res.status(400).json({ message: error });
      })
      .catch(error => {
        return res.status(500).json({ message: "Error happened", error });
      });
  }
  static async delete(req, res) {
    let { username } = req.params;
    const deletedUser = await User.destroy({ where: { username } });
    deletedUser
      .then((error, result) => {
        if (result) {
          res.status(200).json({ message: "Profile deleted successfully", result });
        }
        res.status(400).json({ message: "No user with that username" });
      })
      .catch(error => {
        res.status(500).json({ message: "Error happened", error });
      });
  }
}

export default Profile;
