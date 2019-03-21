import Joi from "joi";
import models from "../models";
import constants from "../helpers/constants";

const { User, Article, Comment, CommentLike } = models;
const { CREATED, BAD_REQUEST, OK, INTERNAL_SERVER_ERROR } = constants.statusCode;

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
    }
  }

  /**
   * @description It allows a user to like a specific comment.
   *
   * @param  {Object} req - The request object.
   * @param  {Object} res - The response object.
   * @returns {Object} - Returns the like created.
   */

  static async like(req, res) {
    const { commentId } = req.params;
    try {
      const comments = await Comment.findOne({ where: { id: commentId } });
      if (!comments) {
        throw new Error("You are liking a non-existing comment");
      }
    } catch (error) {
      if (error.message === "You are liking a non-existing comment") {
        return res
          .status(BAD_REQUEST)
          .json({ message: "You are liking a non-existing comment" });
      }
      return res.status(INTERNAL_SERVER_ERROR).json({ error: error.message });
    }

    try {
      const userId = req.user.id;
      const likes = await CommentLike.findAll({ where: { commentId, userId } });
      if (likes.length === 0) {
        const likeComment = await CommentLike.create({ commentId, userId });
        const updateCommentLikes = await Comment.increment(
          {
            like: 1
          },
          { where: { id: commentId } }
        );
        return res.status(CREATED).json({
          message: "Comment liked",
          likeComment,
          updatedComment: updateCommentLikes[0][0]
        });
      }
      const unlikeComment = await CommentLike.destroy({
        where: { commentId, userId }
      });
      const updateCommentLikes = await Comment.decrement(
        {
          like: 1
        },
        { where: { id: commentId } }
      );
      res.status(CREATED).json({
        message: "Comment Disliked",
        unlikeComment,
        updatedComment: updateCommentLikes[0][0]
      });
    } catch (error) {
      res.status(BAD_REQUEST).json({ error: error.message });
    }
  }

  /**
   * @description It helps to get all users who liked a specific comment.
   *
   * @param  {Object} req - The request object.
   * @param  {Object} res - The response object.
   * @returns {Object} - Returns the comment object.
   */

  static async getCommentLikes(req, res) {
    const { commentId } = req.params;
    try {
      const comment = await Comment.findOne({
        where: { id: commentId },
        include: [
          {
            model: User,
            as: "likes",
            attributes: ["id", "firstname", "username"]
          },
          {
            model: User,
            as: "author",
            attributes: ["id", "firstname", "username"]
          }
        ]
      });
      if (!comment) {
        res
          .status(BAD_REQUEST)
          .json({ message: "There is no comment with that id" });
      }
      res.status(OK).json({ comment });
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR).json({ message: "Sorry, this is not working properly. We now know about this mistake and are working to fix it" });
    }
  }
}
