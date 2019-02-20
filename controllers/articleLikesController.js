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
      const article = await Article.findOne({
        where: {
          slug
        }
      });
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
          await articleLike.destroy();
          return res.status(OK).json({ message: "Unliked successfully" });
        }
        await articleLike.update({ like: true });
        return res.status(OK).json({ message: "Successfully liked" });
      });
    } catch (err) {
      res.status(INTERNAL_SERVER_ERROR).json({
        message: "Unknown error",
        errors: err.stack
      });
    }
  }

  /**
   * @description let user dislike article
   * @param {object} -res The response object
   * @return {object} - returns the response object
   */

  static async dislike(req, res) {
    const { slug } = req.params;
    try {
      const article = await Article.findOne({
        where: {
          slug
        }
      });
      if (!article) {
        return res.status(NOT_FOUND).json({
          message: "Article not found"
        });
      }
      await ArticleLike.findOrCreate({
        where: {
          userId: req.user.id,
          articleId: article.id
        },
        defaults: { like: false }
      }).spread(async (articleLike, created) => {
        if (created) {
          return res.status(CREATED).json({ message: "Successfully disliked" });
        }
        if (!articleLike.like) {
          await articleLike.destroy();
          return res.status(OK).json({ message: "Successfully removed dislike" });
        }
        await articleLike.update({ like: false });
        return res.status(CREATED).json({ message: "Successfully disliked" });
      });
    } catch (err) {
      res.status(INTERNAL_SERVER_ERROR).json({
        message: "Unknown error",
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
        where: {
          slug
        },
        include: [
          {
            model: User,
            as: "likes",
            attributes: [
              "id",
              "username",
              "email",
              "firstname",
              "lastname",
              "bio",
              "image"
            ]
          }
        ]
      });
      if (!article) {
        return res.status(NOT_FOUND).json({ message: "Article not found" });
      }

      return res.status(202).json({ message: "Successfully disliked" });
    } catch (err) {
      res.status(INTERNAL_SERVER_ERROR).json({
        message: "Unknown error",
        errors: err.stack
      });
    }
  }
}
