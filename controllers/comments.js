import models from "../models";
import constants from "../helpers/constants";
import Joi from "joi";
const { User, Article, Comment, commentlike } = models;
const { CREATED, NOT_FOUND, BAD_REQUEST } = constants.statusCode;

export default class CommentController {
  /** This creates the new article's comment
   * @param  {object} req - The request object
   * @param  {object} res - The response object
   * @return {object} - It returns the request response object
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
      const article = await Article.findOne({ where: { slug: slug } });
      if (user && valid && article) {
        const { username, bio, image, following = false } = user;
        const { id: articleId } = article.dataValues;
        const com = await Comment.create({ articleId, userId, body });
        if (com) {
          const { userId, articleId, ...comment } = com.dataValues;
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
      if (error.hasOwnProperty("details"))
        return res
          .status(BAD_REQUEST)
          .send({ message: error.details[0].message, status: BAD_REQUEST });
      else return res.status(500).send({ message: error, status: 500 });
    }
  }
  /**
   * like a comment
   * @param  {object} req - The request object
   * @param  {object} res - The response object
   * @return {object} - It returns the request response object.
   */
  static async like(req, res) {
    const { commentId } = req.params;
    try {
      const comments = await Comment.findAll({ where: { id: commentId } });
      if (comments.length == 0) {
        throw new Error("You are liking a non-existing comment");
      }
    } catch (error) {
      if (error.message == "You are liking a non-existing comment") {
        return res
          .status(400)
          .json({ message: "You are liking a non-existing comment" });
      }
      return res.status(500).json({ error: error.message });
    }

    try {
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
  /**
   * Get all users who liked a specific comment
   *
   * @param  {object} req - The request object
   * @param  {object} res - The response object
   * @returns {object} - returns the comment object
   */
  static async getLikingUsers(req, res) {
    const commentId = req.body.commentId;
    try {
      const usersLikingComment = await Comment.findOne({
        where: { id: commentId },
        include: [{ model: User, as: "likedBy" }]
      });
      if (usersLikingComment.length >= 1) {
        return res.status(200).json({ usersLikingComment });
      }
      return res
        .status(200)
        .json({ message: "No current user who is liking that comment" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}
