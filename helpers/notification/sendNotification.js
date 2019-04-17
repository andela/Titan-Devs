import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
import recordNotification from "./recordNotification";
import notificationTemplate from "./notificationTemplate";

dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
/**
 *
 * @param {uuid} articleId of favorite article
 * @param {string} message message explaining what is happening
 */

const sendArticleNotifications = async (articleId, notification = {}) => {
  const emailList = await recordNotification.articleFavorites(
    articleId,
    notification
  );
  const emailMessage = await notificationTemplate(notification.message);

  if (emailList.length > 0) {
    await sgMail.send({
      to: emailList,
      from: "aheaven@gmail.com",
      subject: "Updates to your favorite article",
      html: emailMessage
    });
  }
};
/**
 *
 * @param {uuid} commentId of favorite comment
 * @param {string} message message explaining what is happening
 */

const sendCommentNotifications = async (commentId, message) => {
  const emailList = await recordNotification.notifyCommentator(
    commentId,
    message.message
  );

  message.commentId = commentId;
  const emailMessage = await notificationTemplate(message);
  if (emailList.length > 0) {
    await sgMail.send({
      to: emailList,
      from: "aheaven@gmail.com",
      subject: "Updates to the comment you liked",
      html: emailMessage
    });
  }
};
/**
 *
 * @param {uuid} userId of the user who is being followed
 * @param {string} message message explaining the updates
 */

const sendFollowersNotifications = async (userId, notification = {}) => {
  const emailList = await recordNotification.notifyFollowers(userId, notification);

  const emailMessage = await notificationTemplate(notification.message);
  if (emailList.length > 0) {
    await sgMail.send({
      to: emailList,
      from: "aheaven@gmail.com",
      subject: "Your favorite author created new article",
      html: emailMessage
    });
  }
};

export default {
  sendArticleNotifications,
  sendCommentNotifications,
  sendFollowersNotifications
};
