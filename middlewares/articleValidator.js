import models from "../models";
import constants from "../helpers/constants";

const { NOT_FOUND } = constants.statusCode;
const { Article } = models;
export default class ArticleValidator {
  static async validateArticle(req, res, next) {
    const article = await Article.findOne({
      where: { slug: req.params.slug }
    });
    req.article = article;
    return article
      ? next()
      : res.status(NOT_FOUND).json({
          message:
            "We are sorry we cannot find the article you are looking for , Please check the id and retry"
        });
  }
}
