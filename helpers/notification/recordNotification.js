import checkFavorite from "./checkFavorite";
import checkFollowers from "./checkFollowers";
import models from "../../models";

const { Notification } = models;
/**
 *
 * @param {uuid} id of the favorite article
 * @param {string} message explaining the reaction happening
 */

const articleFavorites = async (id, message) => {
  const emailList = new Set();
  const notifications = [];
  const usersFavoriteArticle = await checkFavorite.checkWhoFavoriteArticle(id);

  // eslint-disable-next-line array-callback-return
  usersFavoriteArticle.map(users => {
    let email, userId, allowNotifications;
    if (users.dataValues.author) {
      ({
        email,
        id: userId,
        allowNotifications
      } = users.dataValues.author.dataValues);
    } else {
      ({ email, id: userId } = users.dataValues);
    }
    const user = { email, userId, message };
    if (allowNotifications) {
      emailList.add(email);
    }

    notifications.push(user);
  });
  Notification.bulkCreate(notifications);
  return [...emailList];
};
/**
 *
 * @param {uuid} id of the favorite comment
 * @param {string} message explaining the reaction happening
 */

const notifyCommentator = async (id, message) => {
  const emailList = [];
  const notifications = [];
  const commentators = await checkFavorite.checkWhoFavoriteComment(id);

  // eslint-disable-next-line array-callback-return
  commentators[0].dataValues.likes.map(like => {
    const { email, id: userId, allowNotifications } = like.dataValues;
    const user = { email, userId, message };
    if (allowNotifications) {
      emailList.push(email);
    }
    notifications.push(user);
  });
  Notification.bulkCreate(notifications);
  return emailList;
};

const notifyFollowers = async (id, message) => {
  const emailList = [];
  const followers = await checkFollowers(id);
  const notifications = [];

  // eslint-disable-next-line array-callback-return
  followers.map(follower => {
    const {
      email,
      id: userId,
      allowNotifications
    } = follower.dataValues.followings.dataValues;
    const user = { email, userId, message };

    if (allowNotifications) {
      emailList.push(email);
    }
    notifications.push(user);
  });
  Notification.bulkCreate(notifications);
  return emailList;
};
export default { articleFavorites, notifyCommentator, notifyFollowers };
