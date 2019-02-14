import models from "../models";

const { User, Follower } = models;

export default class FollowerController {
  static async followUser(req, res) {
    const { id } = req.user;
    const { username } = req.params;
    try {
      const user = await User.findOne({
        where: {
          username
        }
      });
      const results = await Follower.findOrCreate({
        where: {
          followingId: user.id,
          followerId: id
        }
      }).spread((follower, created) => {
        if (created) {
          console.log(created);
          return res.json({
            message: "Follow success"
          });
        } else {
          res.json({ message: "You already follow this author" });
        }
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Following user failed", errors: error.stack });
    }
  }

  static async unFollow(req, res) {
    const { id } = req.user;
    const { username } = req.params;
    try {
      const user = await User.findOne({
        where: {
          username
        }
      });
      await Follower.destroy({
        where: {
          followingId: id,
          followerId: user.id
        }
      });
      res.json({ message: "You have unfollowed this user " });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Unfollowing user failed", errors: error.stack });
    }
  }

  static async getAllFollowers(req, res) {
    const { username } = req.params;
    try {
      const user = await User.findOne({
        where: {
          username
        }
      });
      const followers = await Follower.findAll({
        where: {
          followingId: user.id
        },
        include: [
          {
            model: User,
            attributes: ["id", "username", "firstname", "lastname", "image", "bio"]
          }
        ]
      });
      res.json({ followers });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Unknown error occurred", errors: error.stack });
    }
  }

  static async getFollowings(req, res) {
    const { username } = req.params;
    try {
      const followings = await User.findOne({
        where: {
          username
        },
        attributes: ["id", "username"],
        include: [
          {
            model: User,
            as: "followings",
            attributes: ["id", "username", "firstname", "lastname", "image", "bio"]
          }
        ]
      });

      res.json({ followings });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Unknown error occurred", errors: error.stack });
    }
  }
}
