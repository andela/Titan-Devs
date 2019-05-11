import models from "../models";
import constants from "../helpers/constants";
import validateComment from "../helpers/validators/commentValidator";
import notification from "../helpers/notification/sendNotification";

const { User, Article, Comment, CommentLike, Commentlog, Highlight } = models;
const {
  CREATED,
  BAD_REQUEST,
  OK,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND
} = constants.statusCode;

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
      const valid = await validateComment(req.body);
      const user = await User.findOne({ where: { id: userId } });
      const article = await Article.findOne({ where: { slug } });
      if (user && valid && article) {
        const { username, bio, image, following = false } = user;
        const { id: articleId } = article.dataValues;
        const com = await Comment.create({ articleId, userId, body });
        if (com) {
          const { userId: uId, articleId: artId, ...comment } = com.dataValues;
          const message = {
            message: "A new user commented on article you reacted on",
            slug
          };
          notification.sendArticleNotifications(articleId, message);
          return res.status(CREATED).json({
            status: CREATED,
            message: "Comment created",
            comment: { ...comment, author: { username, bio, image, following } }
          });
        }
      } else if (!article) {
        return res.status(NOT_FOUND).json({
          status: NOT_FOUND,
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
    const { slug } = req.params;
    try {
      const comments = await Comment.findOne({ where: { id: commentId } });
      if (!comments) {
        return res
          .status(NOT_FOUND)
          .json({ message: "You are liking a non-existing comment" });
      }
      const userId = req.user.id;
      const likes = await CommentLike.findAll({ where: { commentId, userId } });
      if (!likes.length) {
        const likeComment = await CommentLike.create({ commentId, userId });
        const message = {
          message: "A new user is liking a comment you reacted to",
          commentId,
          slug
        };
        notification.sendCommentNotifications(commentId, message);
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
            attributes: ["id", "firstName", "username"]
          },
          {
            model: User,
            as: "author",
            attributes: ["id", "firstName", "username"]
          }
        ]
      });
      if (!comment) {
        return res
          .status(NOT_FOUND)
          .json({ message: "There is no comment with that id" });
      }
      res.status(OK).json({ comment });
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR).json({
        message:
          "Sorry, this is not working properly. We now know about this mistake and are working to fix it"
      });
    }
  }

  /**
   * @description Allows users to fetch a particular comment of an article.
   * @param  {Object} req - The request object.
   * @param  {Object} res - The response object.
   * @returns {Object} - It returns the request response object.
   */
  static async fetch(req, res) {
    try {
      const { id: commentId } = req.params;
      const comment = await Comment.findOne({
        where: { id: commentId },
        include: [{ model: User, as: "author", attributes: ["username", "image"] }],
        attributes: ["like", "body", "createdAt", "updatedAt"]
      });

      if (!comment) {
        return res.status(NOT_FOUND).json({ message: "The comment does not exist" });
      }
      res.status(OK).json({ comment });
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }

  /**
   * @description Allows users to fetch all comments of an article.
   * @param  {Object} req - The request object.
   * @param  {Object} res - The response object.
   * @returns {Object} - It returns the request response object.
   */
  static async fetchAllComments(req, res) {
    try {
      const { slug } = req.params;
      const { pageNumber = 1, limit = 3 } = req.query;
      const article = await Article.findOne({
        where: { slug },
        include: [
          {
            model: Comment,
            as: "comments",
            order: [["createdAt", "DESC"]],
            attributes: [
              "articleId",
              "body",
              "id",
              "createdAt",
              "updatedAt",
              "like"
            ],
            offset: (Number(pageNumber) - 1) * Number(limit),
            limit: Number(limit),
            include: [
              {
                model: User,
                as: "author",
                attributes: ["username", "image", "firstName", "lastName"]
              },
              {
                model: Highlight,
                as: "highlightedText"
              }
            ]
          }
        ]
      });

      if (!article) {
        return res
          .status(NOT_FOUND)
          .json({ message: "There is no article with that slug" });
      }
      res.status(OK).json({ article, commentsLength: article.comments.length });
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }
  /**
   * @description Allows users to update a comment of an article.
   * @param  {Object} req - The request object.
   * @param  {Object} res - The response object.
   * @returns {Object} - It returns the request response object.
   */

  static async update(req, res) {
    try {
      const { body: newBody } = req.body;
      const { id: commentId } = req.params;
      await validateComment(req.body);
      const oldVersion = await Comment.findOne({
        where: { id: commentId },
        attributes: ["body"]
      });
      const comment = await Comment.update(
        { body: newBody },
        { row: true, returning: true, where: { id: commentId } }
      );

      if (!comment[0]) {
        return res.status(NOT_FOUND).json({ message: "The comment does not exist" });
      }
      const commentHistory = await Commentlog.create({
        oldVersion: oldVersion.body,
        newVersion: newBody,
        commentId: comment[1][0].dataValues.id
      });
      res.status(CREATED).json({
        message: "Comment updated successfully",
        comment: commentHistory
      });
    } catch (error) {
      if (error.details[0].message === '"body" is not allowed to be empty') {
        return res.status(BAD_REQUEST).json({ message: "body should not be empty" });
      }
      res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }

  /**
   * @description Allows users to delete a comment of an article.
   * @param  {Object} req - The request object.
   * @param  {Object} res - The response object.
   * @returns {Object} - It returns the request response object.
   */
  static async delete(req, res) {
    try {
      const { id: commentId } = req.params;
      const comment = await Comment.destroy({
        where: { id: commentId },
        returning: true
      });
      if (!comment.length) {
        return res.status(NOT_FOUND).json({ message: "The comment does not exist" });
      }

      res.status(OK).json({
        message: "Comment deleted successfully",
        comment: comment[0].dataValues
      });
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }

  static async getEditHistory(req, res) {
    try {
      const { commentId } = req.params;
      const comment = await Comment.findOne({
        where: { id: commentId },
        include: [
          {
            model: Commentlog,
            as: "commentHistory",
            attributes: ["newVersion", "oldVersion", "createdAt"]
          }
        ]
      });

      if (!comment) {
        return res.status(NOT_FOUND).json({ message: "The comment doesn't exist" });
      }
      res.status(OK).json({ comment: comment.dataValues });
    } catch (error) {
      res.status(INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
  }
}
