import models from "../models";
const { ArticleLike, Article } = models;

/**
 *ArticleLikesController
 *
 * @class
 */

export default class ArticleLikesController {
  /**
   *
   * likeArticle
   *
   * @param {object} -res The response object
   * @return {object} - returns the response object
   */

  static async likeArticle(req, res) {
    try {
      const article = await Article.findOne({
        where: {
          slug: req.slug
        }
      });
      if (!article) {
        return res.status(404).json({
          message: "Article not found"
        });
      }
      await ArticleLike.create({
        userId: req.user.id,
        articleId: article.id
      });
      return res.status(201).json({
        message: "Article liked"
      });
    } catch (err) {
      res.status(500).json({
        message: "Unknown error",
        errors: err.stack
      });
    }
  }

  /**
   *
   * unlikeArticle
   *
   * @param {object} -res The response object
   * @return {object} - returns the response object
   */

  static async unlikeArticle(req, res) {
    try {
      const article = await Article.findOne({
        where: {
          slug: req.slug
        }
      });
      if (!article) {
        return res.status(404).json({
          message: "Article not found"
        });
      }
      const results = await ArticleLike.destroy({
        userId: req.user.id,
        articleId: article.id
      });

      return res.status(202).json({ message: "Article unlike successfully" });
    } catch (err) {
      res.status(500).json({
        message: "Unknown error",
        errors: err.stack
      });
    }
  }

  /**
   *
   * unlikeArticle
   *
   * @param {object} -res The response object
   * @return {object} - returns the response object
   */

  static async getArticleLikes(req, res) {
    try {
      const article = await Article.findOne({
        where: {
          slug: req.slug
        },
        include: [
          {
            model: ArticleLike,
            as: "likes"
          }
        ]
      });
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }

      res.json({ article });
    } catch (err) {
      res.status(500).json({
        message: "Unknown error",
        errors: err.stack
      });
    }
  }
}
