import models from "../../models";

const { Comment, Article, User } = models;

/**
 *
 * @param {uuid} id of favorite article
 */

const checkWhoFavoriteArticle = async id => {
  try {
    const comments = await Comment.findAll({
      where: { articleId: id },
      attributes: ["userId", "body"],
      include: [
        {
          model: User,
          as: "author",
          attributes: ["email", "id", "allowNotifications", "username"]
        }
      ]
    });
    const articlesLikes = await Article.findOne({
      where: {
        id
      },
      include: [
        {
          model: User,
          as: "likes",
          attributes: ["email", "id", "allowNotifications", "username"]
        }
      ]
    });
    return [...comments, ...articlesLikes.dataValues.likes];
  } catch (error) {
    return error.message;
  }
};

/**
 *
 * @param {uuid} id of favorite comment
 */

const checkWhoFavoriteComment = async id => {
  try {
    const commentsLikes = await Comment.findAll({
      where: { id },
      attributes: ["body", "userId"],

      include: [
        {
          model: User,
          as: "likes",
          attributes: ["email", "id", "allowNotifications", "username"]
        }
      ]
    });

    return commentsLikes;
  } catch (error) {
    return error.message;
  }
};

export default { checkWhoFavoriteArticle, checkWhoFavoriteComment };
