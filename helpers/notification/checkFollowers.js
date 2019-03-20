import models from "../../models";

const { Follower, User } = models;
/**
 *
 * @param {uuid} userId of the user being followed
 */

const checkFollowers = async userId => {
  try {
    const followers = await Follower.findAll({
      where: {
        followingId: userId
      },
      attributes: [],

      include: [
        {
          model: User,
          as: "followings",
          attributes: ["email", "id", "allowNotifications"]
        }
      ]
    });
    return followers;
  } catch (error) {
    return { message: error.message };
  }
};

export default checkFollowers;
