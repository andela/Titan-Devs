import models from "../models";
import constants from "../helpers/constants";

const { Article, ReportArticle } = models;

const { INTERNAL_SERVER_ERROR, BAD_REQUEST, OK, CONFLICT } = constants.statusCode;

export default class ReportArticleController {
  /**
   * @description This creates report an article.
   * @param  {Object} req - The request object.
   * @param  {Object} res - The response object.
   * @returns {Object} - It returns the request response object.
   */

  static async reportArticle(req, res) {
    try {
      const { slug } = req.params;
      const { id: userId } = req.user;
      const { description } = req.body;
      if (!description) {
        return res.status(BAD_REQUEST).json({ message: "Please, give a reason" });
      }
      const article = await Article.findOne({ where: { slug } });
      const { id: articleId } = article.dataValues;
      const reportArticle = await ReportArticle.create({
        articleId,
        userId,
        description
      });
      return res.status(OK).json({
        message: "Article reported",
        article: reportArticle
      });
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(CONFLICT).json({
          message: "Article already reported"
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).json({
        message:
          "Sorry, this is not working properly. We now know about this mistake and are working to fix it"
      });
    }
  }
}
