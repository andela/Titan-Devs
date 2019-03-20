import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import recordNotification from "./recordNotification";

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
/**
 *
 * @param {uuid} articleId of favorite article
 * @param {string} message message explaining what is happening
 */

const sendArticleNotifications = async (articleId, message) => {
  const emailList = await recordNotification.articleFavorites(articleId, message);
  if (emailList.length > 0) {
    await sgMail.send({
      to: emailList,
      from: "aheaven@gmail.com",
      subject: "Updates to your favorite article",
      text: message
    });
  }
};
/**
 *
 * @param {uuid} commentId of favorite comment
 * @param {string} message message explaining what is happening
 */

const sendCommentNotifications = async (commentId, message) => {
  const emailList = await recordNotification.notifyCommentator(commentId, message);
  if (emailList.length > 0) {
    await sgMail.send({
      to: emailList,
      from: "aheaven@gmail.com",
      subject: "Updates to the comment you liked",
      text: message
    });
  }
};
/**
 *
 * @param {uuid} userId of the user who is being followed
 * @param {string} message message explaining the updates
 */

const sendFollowersNotifications = async (userId, message) => {
  const emailList = await recordNotification.notifyFollowers(userId, message);
  if (emailList.length > 0) {
    await sgMail.send({
      to: emailList,
      from: "aheaven@gmail.com",
      subject: "Your favorite author created new article",
      text: message
    });
  }
};

export default {
  sendArticleNotifications,
  sendCommentNotifications,
  sendFollowersNotifications
};
