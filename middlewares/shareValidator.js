import models from "../models";

const { Article } = models;
export default class SignupValidator {
  static async validateArticle(req, res, next) {
    const article = await Article.findOne({
      where: { id: req.params.articleId }
    });
    return article
      ? next()
      : res.status(400).json({ message: "Article was not found" });
  }
}
