import models from "../models";
import constants from "../helpers/constants";
import formatFollowers from "../helpers/formatFollowers";

const {
  CREATED,
  NOT_FOUND,
  OK,
  ACCEPTED,
  CONFLICT,
  INTERNAL_SERVER_ERROR
} = constants.statusCode;
const { User, Follower } = models;
const { SERVER_ERROR } = constants.errorMessage;

/**
 *@class FollowerController
 */
export default class FollowerController {
  /**
   * @description It allows a user to follow another user.
   * @param  {Object} req - The request object.
   * @param  {Object} res - The response object.
   * @returns {Object} - It returns the response object.
   */

  static async followUser(req, res) {
    const { id } = req.user;
    const { username } = req.params;
    try {
      const user = await User.findOne({ where: { username } });
      if (!user) {
        return res.status(NOT_FOUND).json({ message: "User not found" });
      }
      await Follower.findOrCreate({
        where: { followingId: user.id, followerId: id }
      }).spread((follower, created) => {
        if (created) {
          return res.status(CREATED).json({ message: "Follow successful" });
        }
        return res.status(CONFLICT).json({
          message: "You are already following this author"
        });
      });
    } catch (error) {
      res.status().json({ message: SERVER_ERROR });
    }
  }

  /**
   * @description Allows a user to unFollow a followed user.
   * @param  {Object} req - The request object.
   * @param  {Object} res - The response object.
   * @returns {Object} - It returns the response object.
   */

  static async unFollow(req, res) {
    const { id } = req.user;
    const { username } = req.params;
    try {
      const user = await User.findOne({ where: { username } });
      if (!user) {
        return res.status(NOT_FOUND).json({ message: "User not found" });
      }
      const results = await Follower.destroy({
        where: { followingId: user.id, followerId: id }
      });
      if (results <= 0) {
        return res.status(NOT_FOUND).json({
          message: "You have already unfollowed this author"
        });
      }
      return res.status(ACCEPTED).json({
        message: "You have unfollowed this author"
      });
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR).json({ message: SERVER_ERROR });
    }
  }

  /**
   * @description It gets the user's followers
   * @param  {Object} req - The request object.
   * @param  {Object} res - The response object.
   * @returns {Object} - It returns the response object.
   */

  static async getAllFollowers(req, res) {
    const { username } = req.params;
    try {
      const user = await User.findOne({ where: { username } });
      if (!user) {
        return res.status(NOT_FOUND).json({ message: "User not found" });
      }
      const followers = await Follower.findAll({
        where: { followingId: user.id },
        include: [
          {
            model: User,
            as: "followings",
            attributes: ["id", "username", "firstName", "lastName", "image", "bio"]
          }
        ]
      });

      return res.status(OK).json({
        message: "Followers retrieved successfully",
        followers: formatFollowers(followers)
      });
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR).json({ message: SERVER_ERROR });
    }
  }

  /**
   * @description Gets all the user's followings.
   * @param  {Object} req - The request object.
   * @param  {Object} res - The response object.
   * @return {Object} - It returns the response object.
   */

  static async getFollowings(req, res) {
    const { username } = req.params;
    try {
      const user = await User.findOne({
        where: { username },
        attributes: ["id", "username"],
        include: [
          {
            model: User,
            as: "followings",
            attributes: ["id", "username", "firstName", "lastName", "image", "bio"]
          }
        ]
      });
      if (!user) {
        return res.status(NOT_FOUND).json({ message: "User not found" });
      }
      return res.status(OK).json({
        message: "Followings retrieved successfully",
        user
      });
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR).json({ message: SERVER_ERROR });
    }
  }
}
