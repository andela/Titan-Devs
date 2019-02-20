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
   * like
   *
   * @param {object} -res The response object
   * @return {object} - returns the response object
   */

  static async like(req, res, next) {
    const { slug } = req.params;
    try {
      const article = await Article.findOne({
        where: {
          slug
        }
      });
      if (!article) {
        return res.status(404).json({
          message: "Article not found"
        });
      }
      ArticleLike.findOrCreate({
        where: {
          userId: req.user.id,
          articleId: article.id
        }
      }).spread((like, created) => {
        if (created) {
          return res.status(201).json({
            message: "Successfully liked"
          });
        }
        return next();
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
   * dislike
   *
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
        return res.status(404).json({
          message: "Article not found"
        });
      }
      await ArticleLike.destroy({
        where: {
          userId: req.user.id,
          articleId: article.id
        }
      });

      return res.status(202).json({ message: "Successfully disliked" });
    } catch (err) {
      res.status(500).json({
        message: "Unknown error",
        errors: err.stack
      });
    }
  }
}
