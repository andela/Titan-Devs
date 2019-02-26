import models from "../models";

const { Article } = models;
export default class ArticleValidator {
  static async validateArticle(req, res, next) {
    const article = await Article.findOne({
      where: { slug: req.params.slug }
    });
    req.article = article;
    return article
      ? next()
      : res.status(404).json({ message: "Article was not found" });
  }
}
