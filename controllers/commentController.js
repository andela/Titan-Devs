import Joi from "joi";
import models from "../models";
import constants from "../helpers/constants";

const { User, Article, Comment, commentlike } = models;
const { CREATED, NOT_FOUND, BAD_REQUEST } = constants.statusCode;

/**
 * @class CommentController
 */
export default class CommentController {
  /**
   * @description Allows users to comment on an article.
   * @param  {Object} req - The request object.
   * @param  {Object} res - The response object.
   * @returns {Object} - It returns the request response object.
   */
  static async create(req, res) {
    try {
      const { body } = req.body;
      const { slug } = req.params;
      const { id: userId } = req.user;
      const valid = await Joi.validate(req.body, {
        body: Joi.string()
          .trim()
          .required()
      });
      const user = await User.findOne({ where: { id: userId } });
      const article = await Article.findOne({ where: { slug } });
      if (user && valid && article) {
        const { username, bio, image, following = false } = user;
        const { id: articleId } = article.dataValues;
        const com = await Comment.create({ articleId, userId, body });
        if (com) {
          const { userId: uId, articleId: artId, ...comment } = com.dataValues;
          return res.status(CREATED).json({
            status: CREATED,
            message: "Comment created",
            comment: { ...comment, author: { username, bio, image, following } }
          });
        }
      } else if (!article) {
        return res.status(BAD_REQUEST).json({
          status: BAD_REQUEST,
          message: `The article with this slug ${slug} doesn't exist`
        });
      }
    } catch (error) {
      if (error.details) {
        return res
          .status(BAD_REQUEST)
          .send({ message: error.details[0].message, status: BAD_REQUEST });
      }
      return res.status(500).send({ message: error, status: 500 });
    }
  }

  /**
   * Like a comment.
   * @param  {Object} req - The request object.
   * @param  {Object} res - The response object.
   * @return {Object} - It returns the request response object.
   */
  static async like(req, res) {
    try {
      const { commentId } = req.params;
      const userId = req.user.id;
      const likes = await commentlike.findAll({ where: { commentId, userId } });
      if (likes.length == 0) {
        const likeComment = await commentlike.create({ commentId, userId });
        const updateCommentLikes = await Comment.increment(
          {
            likes: 1
          },
          { where: { id: commentId } }
        );
        return res
          .status(CREATED)
          .json({ message: "Comment liked", likeComment, updateCommentLikes });
      }
      const unlikeComment = await commentlike.destroy({
        where: { commentId, userId }
      });
      const updateCommentLikes = await Comment.decrement(
        {
          likes: 1
        },
        { where: { id: commentId } }
      );
      res
        .status(CREATED)
        .json({ message: "Comment unliked", unlikeComment, updateCommentLikes });
    } catch (error) {
      res.status(BAD_REQUEST).json({ error: error.message, stack: error.stack });
    }
  }
}
