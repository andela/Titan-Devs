import models from "../models";
import constants from "../helpers/constants";

const { ArticleLike, Article, User } = models;
const { OK, CREATED, INTERNAL_SERVER_ERROR, NOT_FOUND } = constants.statusCode;
/**
 *@description ArticleLikesController
 * @class
 */

export default class ArticleLikesController {
  /**
   * @description let user like article
   * @param {object} -res The response object
   * @return {object} - returns the response object
   */

  static async like(req, res) {
    const { slug } = req.params;
    try {
      const article = await Article.findOne({ where: { slug } });
      if (!article) {
        return res.status(NOT_FOUND).json({
          message: "Article not found"
        });
      }
      ArticleLike.findOrCreate({
        where: {
          userId: req.user.id,
          articleId: article.id
        },
        defaults: { like: true }
      }).spread(async (articleLike, created) => {
        if (created) {
          return res.status(CREATED).json({ message: "Successfully liked" });
        }
        if (articleLike.like) {
          await ArticleLike.destroy({
            where: { userId: req.user.id, articleId: article.id }
          });
          return res.status(OK).json({ message: "Disliked successfully" });
        }
        await ArticleLike.update(
          { like: true },
          { where: { userId: req.user.id, articleId: article.id } }
        );
        return res.status(OK).json({ message: "Successfully liked" });
      });
    } catch (err) {
      res.status(INTERNAL_SERVER_ERROR).json({
        message:
          "Sorry, this is not working properly. We now know about this mistake and are working to fix it",
        errors: err.stack
      });
    }
  }

  /**
   * @description let user dislike article
   * @param {object} -req The request object
   * @param {object} -res The response object
   * @return {object} - returns the response object
   */

  static async dislike(req, res) {
    const { slug } = req.params;
    try {
      const article = await Article.findOne({ where: { slug } });
      if (!article) {
        return res.status(NOT_FOUND).json({ message: "Article not found" });
      }
      await ArticleLike.findOrCreate({
        where: { userId: req.user.id, articleId: article.id },
        defaults: { like: false }
      }).spread(async (articleLike, created) => {
        if (created) {
          return res.status(CREATED).json({ message: "Successfully disliked" });
        }
        if (!articleLike.like) {
          await ArticleLike.destroy({
            where: { userId: req.user.id, articleId: article.id }
          });
          return res.status(OK).json({ message: "Successfully removed dislike" });
        }
        await ArticleLike.update(
          { like: false },
          { where: { userId: req.user.id, articleId: article.id } }
        );
        return res.status(CREATED).json({ message: "Successfully disliked" });
      });
    } catch (err) {
      res.status(INTERNAL_SERVER_ERROR).json({
        message:
          "Sorry, this is not working properly. We now know about this mistake and are working to fix it",
        errors: err.stack
      });
    }
  }

  /**
   * @description - fetch one article
   * @param {object} -res The response object
   * @returns {object} - returns the response object
   */

  static async getArticleLikes(req, res) {
    const { slug } = req.params;
    try {
      const article = await Article.findOne({
        where: { slug },
        include: [
          {
            model: User,
            as: "likes",
            attributes: [
              "id",
              "username",
              "email",
              "firstName",
              "lastName",
              "bio",
              "image"
            ]
          }
        ]
      });
      if (!article) {
        return res.status(NOT_FOUND).json({ message: "Article not found" });
      }
      return res.status(OK).json({ article });
    } catch (err) {
      res.status(INTERNAL_SERVER_ERROR).json({
        message: "Unknown error",
        errors: err.stack
      });
    }
  }
}
