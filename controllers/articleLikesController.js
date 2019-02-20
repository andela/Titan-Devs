import models from "../models";

const { ArticleLike, Article, User } = models;

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
        },
        defaults: { like: true }
      }).spread(async (articleLike, created) => {
        if (created) {
          return res.status(201).json({ message: "Successfully liked" });
        }
        if (articleLike.like) {
          await articleLike.destroy();
          return res.status(200).json({ message: "Unliked successfully" });
        }
        await articleLike.update({ like: true });
        return res.status(201).json({ message: "Successfully liked" });
      });
    } catch (err) {
      res.status(500).json({
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
        return res.status(404).json({
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
          return res.status(202).json({ message: "Successfully disliked" });
        }
        if (!articleLike.like) {
          await articleLike.destroy();
          return res.status(202).json({ message: "Successfully removed disliked" });
        }
        await articleLike.update({ like: false });
        return res.status(202).json({ message: "Successfully disliked" });
      });
    } catch (err) {
      res.status(500).json({
        message: "Unknown error",
        errors: err.stack
      });
    }
  }

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
        return res.status(404).json({ message: "Article not found" });
      }

      res.json({ article });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Unknown error",
        errors: err.stack
      });
    }
  }
}
